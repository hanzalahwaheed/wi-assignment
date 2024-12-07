import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/database";
import { User } from "../types";

export class UserService {
  static async createUser(
    username: string,
    password: string,
    email: string
  ): Promise<Omit<User, "password">> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING id, username, email, role, created_at",
      [username, hashedPassword, email]
    );
    return result.rows[0];
  }

  static async validateUser(
    username: string,
    password: string,
    requireAdmin: boolean = false
  ): Promise<string | null> {
    // Build query based on role requirement
    const query = requireAdmin
      ? "SELECT * FROM users WHERE username = $1 AND role = 'admin'"
      : "SELECT * FROM users WHERE username = $1";

    const result = await pool.query(query, [username]);
    const user = result.rows[0];

    if (!user) {
      return null;
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return null;
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET environment variable is not set");
    }

    return jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );
  }
}
