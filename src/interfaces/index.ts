import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";
import mongoose from "mongoose";

export interface UserPayload {
  id: string;
  email: string;
}

export interface AuthRequest extends Request {
  user?: UserPayload;
  token?: string;
}

export interface TokenPayload extends JwtPayload {
  userId: mongoose.Types.ObjectId;
}
