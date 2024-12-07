import express from "express";
import { UserController } from "../controllers/user";

const router = express.Router();

router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.post("/login-admin", UserController.loginAsAdmin);

export default router;
