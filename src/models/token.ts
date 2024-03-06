import mongoose from "mongoose";

interface IToken {
  userId: mongoose.Schema.Types.ObjectId;
  token: string;
  createdAt: Date;
}

const tokenSchema = new mongoose.Schema<IToken>({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: "1d" }, // Token expires after 1 day
});

const Token = mongoose.model<IToken>("Token", tokenSchema);

export default Token;
