import mongoose from "mongoose";

interface IBlacklistedToken {
  token: string;
  createdAt: Date;
}

const blacklistedTokenSchema = new mongoose.Schema<IBlacklistedToken>({
  token: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: "15m",
  },
});

const BlacklistedToken = mongoose.model<IBlacklistedToken>(
  "BlacklistedToken",
  blacklistedTokenSchema
);

export default BlacklistedToken;
