import mongoose, { Schema, model } from 'mongoose';

const InterestSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    category: { type: String, required: true, trim: true },
    users: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }],
  },
  {
    timestamps: true,
  }
);

export default model('Interest', InterestSchema);
