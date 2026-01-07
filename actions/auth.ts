"use server";

import { pool } from "@/lib/db";
import bcrypt from "bcryptjs";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import { createSession, deleteSession, verifySession } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function registerUser(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!name || !email || !password) {
    return { success: false, message: "All fields are required" };
  }

  if (password.length < 8) {
    return { success: false, message: "Password must be at least 8 characters" };
  }

  try {
    const connection = await pool.getConnection();

    try {
      // Check if user already exists
      const [existingUsers] = await connection.query<RowDataPacket[]>(
        "SELECT id FROM users WHERE email = ?",
        [email]
      );

      if (existingUsers.length > 0) {
        return { success: false, message: "An account with this email already exists" };
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      // Insert new user
      const [result] = await connection.query<ResultSetHeader>(
        "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
        [name, email, passwordHash]
      );

      // Create session immediately after registration
      await createSession(result.insertId.toString());

      return { success: true, message: "Account created successfully" };
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Registration error:", error);
    return { success: false, message: "Something went wrong. Please try again." };
  }
}

export async function loginUser(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
        return { success: false, message: "Email and password are required" };
    }

    try {
        const connection = await pool.getConnection();
        try {
            const [users] = await connection.query<RowDataPacket[]>(
                "SELECT id, password_hash FROM users WHERE email = ?",
                [email]
            );

            if (users.length === 0) {
                return { success: false, message: "Invalid email or password" };
            }

            const user = users[0];
            const isValid = await bcrypt.compare(password, user.password_hash);

            if (!isValid) {
                return { success: false, message: "Invalid email or password" };
            }

            await createSession(user.id.toString());
            return { success: true, message: "Logged in successfully" };

        } finally {
            connection.release();
        }
    } catch (error) {
        console.error("Login error:", error);
        return { success: false, message: "Something went wrong. Please try again." };
    }
}

export async function logoutUser() {
    await deleteSession();
    redirect("/");
}

export async function getCurrentUser() {
    const session = await verifySession();
    if (!session) return null;

    try {
        const connection = await pool.getConnection();
        try {
            const [users] = await connection.query<RowDataPacket[]>(
                "SELECT id, name, email FROM users WHERE id = ?",
                [session.userId]
            );
            return users[0] || null;
        } finally {
            connection.release();
        }
    } catch {
        return null;
    }
}
