import mongoose, { Schema, model } from "mongoose";

const UserSchema = new Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
    bio: { type: String, default: "" },
    location: { type: String, default: "" },
    profilePicture: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" },
    },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    interests: [{ type: Schema.Types.ObjectId, ref: "Interest", default: [] }],
    onboardingStatus: {
      type: String,
      enum: ["PROFILE", "INTERESTS", "COMPLETED"],
      default: "NOT_STARTED",
    },
  },
  {
    timestamps: true,
  },
);

export default model("User", UserSchema);
