import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: true
    },

    // NEW FIELD (for admin / client panel)
    role: {
      type: String,
      enum: ["admin", "client"],
      default: "client"
    }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
