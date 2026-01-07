
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import mysql from 'mysql2/promise';
import bcrypt from "bcryptjs";
import { RowDataPacket } from "mysql2";

// Database configuration
const poolConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'project_1',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

// Helper to get DB connection
async function getDb() {
    return mysql.createPool(poolConfig);
}

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
        GitHubProvider({
            clientId: process.env.GITHUB_ID || "",
            clientSecret: process.env.GITHUB_SECRET || "",
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                try {
                    const pool = await getDb();
                    const [users] = await pool.query<RowDataPacket[]>(
                        "SELECT * FROM users WHERE email = ?",
                        [credentials.email]
                    );

                    const user = users[0];

                    if (!user || !user.password_hash) {
                        return null;
                    }

                    const isValid = await bcrypt.compare(credentials.password, user.password_hash);

                    if (!isValid) {
                        return null;
                    }

                    return {
                        id: user.id.toString(),
                        name: user.name,
                        email: user.email,
                        image: user.image,
                    };
                } catch (error) {
                    console.error("Auth error:", error);
                    return null;
                }
            }
        })
    ],
    pages: {
        signIn: '/signin',
        error: '/signin',
    },
    callbacks: {
        async signIn({ user, account }) {
            // For OAuth providers, we need to handle user creation/linking
            if (account?.provider === 'google' || account?.provider === 'github') {
                if (!user.email) return false;

                try {
                    const pool = await getDb();

                    // Check if user exists
                    const [existingUsers] = await pool.query<RowDataPacket[]>(
                        "SELECT id FROM users WHERE email = ?",
                        [user.email]
                    );

                    if (existingUsers.length === 0) {
                        // Create new user
                        await pool.query(
                            "INSERT INTO users (name, email, image, auth_provider) VALUES (?, ?, ?, ?)",
                            [user.name, user.email, user.image, account.provider]
                        );
                    }
                    return true;
                } catch (error) {
                    console.error("SignIn callback error:", error);
                    return false;
                }
            }
            return true;
        },
        async jwt({ token, user, account }) {
            // On initial sign in
            if (user) {
                // If it's an OAuth sign in, user.id might be the provider ID or something else.
                // We need to fetch the internal DB ID to be consistent.

                // If Credentials login, 'authorize' returns the object with the correct DB id.
                // If OAuth, 'user' comes from the provider profile.

                if (account?.provider === 'google' || account?.provider === 'github') {
                    try {
                        const pool = await getDb();
                        const [rows] = await pool.query<RowDataPacket[]>(
                            "SELECT id FROM users WHERE email = ?",
                            [user.email]
                        );
                        if (rows.length > 0) {
                            token.id = rows[0].id.toString();
                        }
                    } catch (error) {
                        console.error("JWT callback error:", error);
                    }
                } else {
                    // Credentials provider
                    token.id = user.id;
                }
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                // @ts-ignore
                session.user.id = token.id as string;
            }
            return session;
        }
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET || "supersecret",
};
