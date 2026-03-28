
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import { prisma } from "@/lib/db"
import bcrypt from "bcryptjs"

const googleClientId = process.env.GOOGLE_CLIENT_ID || process.env.AUTH_GOOGLE_ID;
const googleClientSecret =
    process.env.GOOGLE_CLIENT_SECRET || process.env.AUTH_GOOGLE_SECRET;

export const { handlers, signIn, signOut, auth } = NextAuth({
    basePath: "/api/auth",
    providers: [
        Google({
            clientId: googleClientId,
            clientSecret: googleClientSecret,
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
            if (account?.provider === 'google') {
                if (!user.email) return false;
                const normalizedEmail = user.email.toLowerCase().trim();

                try {
                    const dbUser = await prisma.user.upsert({
                        where: { email: normalizedEmail },
                        create: {
                            name: user.name || 'User',
                            email: normalizedEmail,
                            role: 'user',
                            image: user.image || null
                        },
                        update: {
                            name: user.name || undefined,
                            image: user.image || undefined,
                        },
                    });

                    await prisma.account.upsert({
                        where: {
                            provider_providerAccountId: {
                                provider: account.provider,
                                providerAccountId: account.providerAccountId,
                            },
                        },
                        create: {
                            userId: dbUser.id,
                            type: account.type,
                            provider: account.provider,
                            providerAccountId: account.providerAccountId,
                            accessToken: account.access_token || null,
                            tokenType: account.token_type || null,
                            scope: account.scope || null,
                            idToken: account.id_token || null,
                            expiresAt: account.expires_at || null,
                            refreshToken: account.refresh_token || null,
                        },
                        update: {
                            userId: dbUser.id,
                            accessToken: account.access_token || null,
                            tokenType: account.token_type || null,
                            scope: account.scope || null,
                            idToken: account.id_token || null,
                            expiresAt: account.expires_at || null,
                            refreshToken: account.refresh_token || null,
                        },
                    });

                    await prisma.newsletterSubscriber.upsert({
                        where: { email: normalizedEmail },
                        create: {
                            email: normalizedEmail,
                            source: "google-oauth",
                            locale: null,
                        },
                        update: {},
                    });

                    user.id = dbUser.id.toString();
                    user.email = dbUser.email;
                    user.name = dbUser.name;
                    user.image = dbUser.image;
                    (user as { role?: string }).role = dbUser.role;
                } catch (error) {
                    console.error("SignIn callback error:", error);
                    return false;
                }
            }
            return true;
        },
        async jwt({ token, user }) {
            if (user) {
                const userRole =
                    typeof (user as { role?: unknown }).role === "string"
                        ? (user as { role: string }).role
                        : undefined;
                token.id = user.id;
                token.role = userRole;
                token.email = user.email ?? token.email;
                token.picture = user.image;
            }
            if (!token.role && token.email) {
                const dbUser = await prisma.user.findUnique({
                    where: { email: token.email.toLowerCase() },
                    select: { id: true, role: true, image: true },
                });
                if (dbUser) {
                    token.id = String(dbUser.id);
                    token.role = dbUser.role;
                    token.picture = dbUser.image ?? token.picture;
                }
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.role =
                    typeof token.role === "string" ? token.role : undefined;
                session.user.email = typeof token.email === "string" ? token.email : session.user.email;
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
