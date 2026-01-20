
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import GitHub from "next-auth/providers/github"
import { prisma } from "@/lib/db"
import bcrypt from "bcryptjs"

export const { handlers, signIn, signOut, auth } = NextAuth({
    basePath: "/api/auth",
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
                    const user = await prisma.user.findUnique({
                        where: { email: credentials.email as string }
                    });

                    if (!user) {
                        return null;
                    }

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
                    // Check if user exists
                    let dbUser = await prisma.user.findUnique({
                        where: { email: user.email }
                    });

                    if (!dbUser) {
                        // Create new user for OAuth
                        dbUser = await prisma.user.create({
                            data: {
                                name: user.name || 'User',
                                email: user.email,
                                role: 'user',
                                image: user.image || null
                            }
                        });

                        user.id = dbUser.id.toString();

                        // Create account record
                        await prisma.account.create({
                            data: {
                                userId: dbUser.id,
                                type: account.type,
                                provider: account.provider,
                                providerAccountId: account.providerAccountId,
                                accessToken: account.access_token || null,
                                tokenType: account.token_type || null
                            }
                        });
                    } else {
                        user.id = dbUser.id.toString();

                        // Update existing account or create if not exists
                        // Note: provider + providerAccountId should be unique, but here we check by user_id + provider
                        const existingAccount = await prisma.account.findFirst({
                            where: {
                                userId: dbUser.id,
                                provider: account.provider
                            }
                        });

                        if (!existingAccount) {
                            await prisma.account.create({
                                data: {
                                    userId: dbUser.id,
                                    type: account.type,
                                    provider: account.provider,
                                    providerAccountId: account.providerAccountId,
                                    accessToken: account.access_token || null,
                                    tokenType: account.token_type || null
                                }
                            });
                        }
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
    trustHost: true,
})
