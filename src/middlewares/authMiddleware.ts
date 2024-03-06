import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import getEnv from "../utils/getEnv";
import { AuthRequest, UserPayload } from "../interfaces";
import { UnauthorizedError } from "../errors/CustomError";
import BlacklistedToken from "../models/blacklistedTokens";

const jwtSecret = getEnv("JWT_SECRET");

export const auth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token = req.token;
  if (!token) {
    return next(new UnauthorizedError("No token provided"));
  }

  const isTokenBlacklisted = await BlacklistedToken.findOne({ token });
  if (isTokenBlacklisted) {
    return next(new UnauthorizedError("Token Invalidated"));
  }

  try {
    const decoded = jwt.verify(token, jwtSecret) as UserPayload;
    req.user = decoded;
  } catch (error) {
    return next(new UnauthorizedError("Invalid Token"));
  }

  next();
};

export const extractAccessToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return next(new UnauthorizedError("No token provided"));
  }

  req.token = token;

  next();
};
