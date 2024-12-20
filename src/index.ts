import express from "express";
import { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import "dotenv/config";
import userRoutes from "./routes/user";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
  res.send("Hello World!");
});

app.use("/api/v0/users", userRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
