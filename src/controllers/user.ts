import { Request, Response } from "express";
import { UserService } from "../services/user";
import { userSchema } from "../utils/validations";

export class UserController {
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const { username, password, email } = userSchema.parse(req.body);
      const user = await UserService.createUser(username, password, email);
      res.status(201).json(user);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Error registering user" });
      }
    }
  }

  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { username, password } = req.body;
      const token = await UserService.validateUser(username, password);

      if (!token) {
        res.status(401).json({ error: "Invalid credentials" });
        return;
      }

      res.json({ token });
    } catch (error) {
      res.status(500).json({ error: "Error logging in" });
    }
  }

  static async loginAsAdmin(req: Request, res: Response): Promise<void> {
    try {
      const { username, password } = req.body;
      const token = await UserService.validateUser(username, password, true);

      if (!token) {
        res.status(401).json({ error: "Invalid admin credentials" });
        return;
      }

      res.json({ token });
    } catch (error) {
      res.status(500).json({ error: "Error logging in as admin" });
    }
  }
}
