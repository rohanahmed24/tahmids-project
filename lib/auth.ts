import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secretKey = "secret-key-wisdomia-2024"; // In prod, use env variable
const key = new TextEncoder().encode(secretKey);

export async function createSession(userId: string) {
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day
    const session = await new SignJWT({ userId })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("24h")
        .sign(key);

    (await cookies()).set("session", session, {
        httpOnly: true,
        secure: false, // process.env.NODE_ENV === "production",
        expires,
        sameSite: "lax",
        path: "/",
    });
}

export async function verifySession() {
    const cookie = (await cookies()).get("session")?.value;
    if (!cookie) return null;

    try {
        const { payload } = await jwtVerify(cookie, key, {
            algorithms: ["HS256"],
        });
        return payload as { userId: string };
    } catch (error) {
        return null;
    }
}

export async function deleteSession() {
    (await cookies()).delete("session");
}
