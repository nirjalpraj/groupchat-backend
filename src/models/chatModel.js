import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    msg: {
      type: String,
      required: true,
    },
  },
  {
    sender: {
      type: String,
      required: true,
    },
  },
  {
    type: {
      type: String,
      enum: ["ownMsg", "otherMsg"],
      required: true,
    },
  },
  { timestamps: true }
);

export const Chat = mongoose.model("Chat", chatSchema);
