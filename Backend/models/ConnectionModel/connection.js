import mongoose, { Schema, model } from "mongoose";

const ConnectionSchema = new Schema(
  {
    userA: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userB: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    requestedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "connected", "rejected"],
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

ConnectionSchema.index(
    {userA: 1, userB: 1},
    {unique: true}
)

ConnectionSchema.index({userA: 1, status: 1});
ConnectionSchema.index({userB: 1, status: 1});


export default model("Connection", ConnectionSchema);
