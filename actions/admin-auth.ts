import { signIn, signOut, auth } from "@/auth";
import { AuthError } from "next-auth";

// Default admin email for password-only login flow
const ADMIN_EMAIL = "admin@thewisdomia.com";

export async function loginAdmin(password: string) {
    try {
        await signIn("credentials", {
            email: ADMIN_EMAIL,
            password: password,
            redirect: false,
        });
        return { success: true };
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { error: "Invalid credentials" };
                default:
                    return { error: "Something went wrong" };
            }
        }
        throw error;
    }
}

export async function logoutAdmin() {
    await signOut({ redirectTo: "/admin" });
}

export async function verifyAdmin() {
    const session = await auth();
    return session?.user?.role === 'admin';
}
