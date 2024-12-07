import { Request } from "express";

export interface User {
  id: number;
  username: string;
  email: string;
  role: "admin" | "user";
  created_at: Date;
}

export interface AuthRequest extends Request {
  user?: {
    id: number;
    username: string;
    role: string;
  };
}
