import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../types/index.js";

export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) {
    res.status(401).json({ error: "Access token required" });
    return;
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");
    req.user = user as AuthRequest["user"];
    next();
  } catch (error) {
    res.status(403).json({ error: "Invalid token" });
  }
};

export const isAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (req.user?.role === "admin") {
    next();
  } else {
    res.status(403).json({ error: "Admin access required" });
  }
};

export const validateApiKey = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const apiKey = req.headers["x-api-key"];

  if (!apiKey || apiKey !== process.env.ADMIN_API_KEY) {
    res.status(401).json({ error: "Invalid API key" });
    return;
  }

  next();
};
