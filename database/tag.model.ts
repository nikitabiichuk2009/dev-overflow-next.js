import { Schema, models, model, Document } from "mongoose";

// Define the ITag interface extending Document for type safety
export interface ITag extends Document {
  name: string;
  description: string;
  questions: Schema.Types.ObjectId[];
  followers: Schema.Types.ObjectId[];
  createdAt: Date;
}

// Define the Tag schema with appropriate fields and types
const TagSchema = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, default: "" },
  questions: [{ type: Schema.Types.ObjectId, ref: "Question" }], // Reference to questions
  followers: [{ type: Schema.Types.ObjectId, ref: "User" }], // Reference to followers
  createdAt: { type: Date, default: Date.now }, // Date the tag was created
});

// Create and export the Tag model
const Tag = models.Tag || model<ITag>("Tag", TagSchema);

export default Tag;
