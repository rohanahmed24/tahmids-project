
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import GitHub from "next-auth/providers/github"
import { pool } from "@/lib/db"
import bcrypt from "bcryptjs"
import { RowDataPacket, ResultSetHeader } from "mysql2"

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        GitHub({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
        }),
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            authorize: async (credentials) => {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                try {
                    const [rows] = await pool.query<RowDataPacket[]>(
                        "SELECT id, name, email, password, role, image FROM users WHERE email = ?",
                        [credentials.email]
                    );

                    if (rows.length === 0) {
                        return null;
                    }

                    const user = rows[0];

                    // Check if user has a password (for OAuth users, password might be null)
                    if (!user.password) {
                        return null;
                    }

                    const isValid = await bcrypt.compare(credentials.password as string, user.password);

                    if (!isValid) return null;

                    return {
                        id: user.id.toString(),
                        name: user.name,
                        email: user.email,
                        image: user.image || null,
                        role: user.role
                    };
                } catch (error) {
                    console.error("Auth error:", error);
                    return null;
                }
            }
        })
    ],
    callbacks: {
        async signIn({ user, account }) {
            if (account?.provider === 'google' || account?.provider === 'github') {
                if (!user.email) return false;

                try {
                    const connection = await pool.getConnection();
                    try {
                        // Check if user exists
                        const [rows] = await connection.query<RowDataPacket[]>(
                            "SELECT id, name, email, role, image FROM users WHERE email = ?",
                            [user.email]
                        );

                        if (rows.length === 0) {
                            // Create new user for OAuth
                            const [result] = await connection.query<ResultSetHeader>(
                                "INSERT INTO users (name, email, role, image) VALUES (?, ?, ?, ?)",
                                [
                                    user.name || 'User',
                                    user.email,
                                    'user',
                                    user.image || null
                                ]
                            );
                            user.id = result.insertId.toString();

                            // Create account record
                            await connection.query(
                                `INSERT INTO accounts (user_id, type, provider, provider_account_id, access_token, token_type) 
                                 VALUES (?, ?, ?, ?, ?, ?)`,
                                [
                                    result.insertId,
                                    account.type,
                                    account.provider,
                                    account.providerAccountId,
                                    account.access_token || null,
                                    account.token_type || null
                                ]
                            );
                        } else {
                            user.id = rows[0].id.toString();

                            // Update existing account or create if not exists
                            const [accountRows] = await connection.query<RowDataPacket[]>(
                                "SELECT id FROM accounts WHERE user_id = ? AND provider = ?",
                                [rows[0].id, account.provider]
                            );

                            if (accountRows.length === 0) {
                                await connection.query(
                                    `INSERT INTO accounts (user_id, type, provider, provider_account_id, access_token, token_type) 
                                     VALUES (?, ?, ?, ?, ?, ?)`,
                                    [
                                        rows[0].id,
                                        account.type,
                                        account.provider,
                                        account.providerAccountId,
                                        account.access_token || null,
                                        account.token_type || null
                                    ]
                                );
                            }
                        }
                    } finally {
                        connection.release();
                    }
                } catch (error) {
                    console.error("SignIn callback error:", error);
                    return false;
                }
            }
            return true;
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                token.role = (user as any).role;
                token.picture = user.image;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (session.user as any).role = token.role;
                session.user.image = token.picture;
            }
            return session;
        }
    },
    pages: {
        signIn: '/signin',
        error: '/signin',
    },
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    secret: process.env.AUTH_SECRET,
})
