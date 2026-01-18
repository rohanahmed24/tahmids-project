import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function authorizeUser(credentials: Partial<Record<"email" | "password", unknown>>) {
    if (!credentials?.email || !credentials?.password) {
        return null;
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email: credentials.email as string }
        });

        if (!user || !user.password) {
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
