
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
                    "SELECT * FROM users WHERE email = ?",
                    [credentials.email]
                 );

                 if (rows.length === 0) {
                     return null;
                 }

                 const user = rows[0];

                 const isValid = await bcrypt.compare(credentials.password as string, user.password_hash);

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
    async signIn({ user, account, profile }) {
        if (account?.provider === 'google' || account?.provider === 'github') {
            if (!user.email) return false;

            try {
                const connection = await pool.getConnection();
                try {
                    const [rows] = await connection.query<RowDataPacket[]>(
                        "SELECT * FROM users WHERE email = ?",
                        [user.email]
                    );

                    if (rows.length === 0) {
                        // Create new user
                        const dummyPassword = `oauth:${account.provider}:${account.providerAccountId}:${Date.now()}`;
                        const salt = await bcrypt.genSalt(10);
                        const hash = await bcrypt.hash(dummyPassword, salt);

                        try {
                            const [result] = await connection.query<ResultSetHeader>(
                                "INSERT INTO users (name, email, password_hash, role, image, provider, provider_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
                                [
                                    user.name || 'User',
                                    user.email,
                                    hash,
                                    'user',
                                    user.image || null,
                                    account.provider,
                                    account.providerAccountId
                                ]
                            );
                            user.id = result.insertId.toString();
                        } catch (insertError: any) {
                             if (insertError.code === 'ER_BAD_FIELD_ERROR') {
                                 console.warn("Extended columns missing, falling back to basic schema");
                                 const [result] = await connection.query<ResultSetHeader>(
                                    "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)",
                                    [user.name || 'User', user.email, hash, 'user']
                                );
                                user.id = result.insertId.toString();
                             } else {
                                 throw insertError;
                             }
                        }
                    } else {
                        user.id = rows[0].id.toString();
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
    async jwt({ token, user, account }) {
        if (user) {
            token.id = user.id;
            token.picture = user.image;
        }
        return token;
    },
    async session({ session, token }) {
        if (session.user) {
            session.user.id = token.id as string;
            session.user.image = token.picture;
        }
        return session;
    }
  },
  pages: {
    signIn: '/signin',
    error: '/signin',
  },
  secret: process.env.AUTH_SECRET, // Make sure to set AUTH_SECRET in .env
})
