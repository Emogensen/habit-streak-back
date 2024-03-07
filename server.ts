require("dotenv").config();
import express, { Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./src/config/db";
import authRouter from "./src/routes/authRoutes";
import userRouter from "./src/routes/userRoutes";
import { CustomError } from "./src/errors/CustomError";
import { AuthRequest } from "./src/interfaces";

const app = express();
const PORT = process.env.PORT || 4000;

connectDB();

app.use(cookieParser());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use("/auth", authRouter);
app.use("/users", userRouter);

app.use((err: Error, req: AuthRequest, res: Response, next: NextFunction) => {
  if (err instanceof CustomError) {
    return res
      .status(err.statusCode)
      .json({ success: false, message: err.message });
  }

  res
    .status(500)
    .json({ success: false, message: "An unexpected error occurred" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
