import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    sender: {
      type: String,
      enum: ["client", "staff"],
      default: "client",
    },
  },
  {
    timestamps: true,
  },
  { versionKey: false },
);

export const MessageModel = mongoose.model("Message", messageSchema);
