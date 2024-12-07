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
    password: string
  ): Promise<string | null> {
    const result = await pool.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);
    const user = result.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return null;
    }

    return jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "24h" }
    );
  }
}
