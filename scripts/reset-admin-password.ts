// Script to create/reset admin user password
import { prisma } from "../lib/db";
import bcrypt from "bcryptjs";

async function resetAdminPassword() {
    const email = "tahmid@wisdomia.com";
    const password = "wisdomia2024";

    try {
        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            // Update password
            await prisma.user.update({
                where: { email },
                data: {
                    password: passwordHash,
                    role: "admin"
                }
            });
            console.log("✅ Password updated for:", email);
        } else {
            // Create new admin user
            await prisma.user.create({
                data: {
                    name: "Tahmid",
                    email,
                    password: passwordHash,
                    role: "admin"
                }
            });
            console.log("✅ Admin user created:", email);
        }

        console.log("Password set to:", password);
    } catch (error) {
        console.error("Error:", error);
    } finally {
        await prisma.$disconnect();
    }
}

resetAdminPassword();
