import { Schema, models, model, Document } from "mongoose";

// Define the IInteraction interface extending Document for type safety
export interface IInteraction extends Document {
  user: Schema.Types.ObjectId;
  action: string;
  question: Schema.Types.ObjectId;
  answer: Schema.Types.ObjectId;
  tag: Schema.Types.ObjectId;
  createdAt: Date;
}

// Define the Interaction schema with appropriate fields and types
const InteractionSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  action: { type: String, required: true },
  question: { type: Schema.Types.ObjectId, ref: "Question" },
  answer: { type: Schema.Types.ObjectId, ref: "Answer" },
  tag: { type: Schema.Types.ObjectId, ref: "Tag" },
  createdAt: { type: Date, default: Date.now }
});

// Create and export the Interaction model
const Interaction = models.Interaction || model<IInteraction>("Interaction", InteractionSchema);

export default Interaction;
