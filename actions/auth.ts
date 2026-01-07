"use server";

import { pool } from "@/lib/db";
import bcrypt from "bcryptjs";
import { RowDataPacket, ResultSetHeader } from "mysql2";

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
      await connection.query<ResultSetHeader>(
        "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
        [name, email, passwordHash]
      );

      return { success: true, message: "Account created successfully" };
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Registration error:", error);
    return { success: false, message: "Something went wrong. Please try again." };
  }
}
