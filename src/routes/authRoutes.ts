import { Request, Response, Router } from "express";
import User from "../models/user";
import jwt, { JwtPayload } from "jsonwebtoken";
import getEnv from "../utils/getEnv";
import { AuthRequest, TokenPayload, UserPayload } from "../interfaces";
import BlacklistedToken from "../models/blacklistedTokens";
import { auth, extractAccessToken } from "../middlewares/authMiddleware";
import mongoose from "mongoose";
import Token from "../models/token";

const authRouter = Router();

const jwtSecret = getEnv("JWT_SECRET");
const refreshSecret = getEnv("REFRESH_SECRET");

const generateAccessToken = (userId: mongoose.Types.ObjectId) => {
  return jwt.sign({ id: userId }, jwtSecret, { expiresIn: "15m" });
};

const generateRefreshToken = (userId: mongoose.Types.ObjectId) => {
  return jwt.sign({ userId: userId }, refreshSecret, { expiresIn: "1d" });
};

authRouter.post("/register", async (req: Request, res: Response) => {
  try {
    const userWithPassword = new User(req.body);

    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).send({
        success: false,
        message: "The provided email address is already registered.",
      });
    }
    await userWithPassword.save();

    const { password: _, ...user } = userWithPassword.toObject({
      getters: true,
    });

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    await new Token({ userId: user._id, token: refreshToken }).save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });
    res.status(200).send({ user, accessToken });
  } catch (error) {
    res.status(400).send(error);
  }
});

authRouter.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const userWithPassword = await User.findOne({ email });

    if (
      !userWithPassword ||
      !(await userWithPassword.comparePassword(password))
    ) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Destructure the user document and reconstruct without the password
    const { password: _, ...user } = userWithPassword.toObject({
      getters: true,
    });

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    await new Token({ userId: user._id, token: refreshToken }).save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });
    res.status(200).send({ user, accessToken });
  } catch (error) {
    res.status(400).send(error);
  }
});

authRouter.post(
  "/logout",
  extractAccessToken,
  auth,
  async (req: AuthRequest, res: Response) => {
    const { token } = req;

    if (token) {
      try {
        await BlacklistedToken.create({ token });
        res
          .status(200)
          .send({ success: true, message: "Logged out successfully" });
      } catch (error) {
        res.status(500).send({ error: "Error logging out" });
      }
    } else {
      res.status(400).send({ error: "No token provided" });
    }
  }
);

authRouter.post("/token/renew", async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) {
    return res.status(401).json({ error: "Refresh token required" });
  }

  const tokenDoc = await Token.findOne({ token: refreshToken });
  if (!tokenDoc) {
    return res.status(401).json({ error: "Invalid refresh token" });
  }

  try {
    const payload = jwt.verify(refreshToken, refreshSecret) as TokenPayload;
    const accessToken = generateAccessToken(payload.userId);

    res.status(200).send({ accessToken });
  } catch (error) {
    return res.status(403).json({ error: "Token expired or invalid" });
  }
});

authRouter.get(
  "/token/validate",
  extractAccessToken,
  auth,
  (req: Request, res: Response) => {
    res.json({ success: true, message: "Token is valid" });
  }
);

export default authRouter;
