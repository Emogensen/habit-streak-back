import { Request, Response, Router } from "express";
import { auth, extractAccessToken } from "../middlewares/authMiddleware";
import User from "../models/user";

const userRouter = Router();

userRouter.get(
  "/:userId",
  extractAccessToken,
  auth,
  async (req: Request, res: Response) => {
    try {
      const userId = req.params.userId;
      const user = await User.findById(userId).select(
        "name email createdAt -_id"
      );

      if (!user) {
        return res.status(404).send({
          success: false,
          message: "User not found.",
        });
      }

      res.status(200).send(user);
    } catch (error) {
      console.error(error);
      res.status(500).send({
        success: false,
        message: "An error occurred while retrieving user information.",
      });
    }
  }
);

export default userRouter;
