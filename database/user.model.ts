import { Schema, models, model, Document } from "mongoose";

// Define the IUser interface extending Document for type safety
export interface IUser extends Document {
  clerkId: string;
  name: string;
  username: string;
  email: string;
  password?: string;
  bio?: string;
  picture?: string;
  location?: string;
  portfolio?: string;
  reputation?: number;
  joinDate: Date;
  savedPosts: Schema.Types.ObjectId[];
}

// Define the User schema with appropriate fields and types
const UserSchema = new Schema({
  clerkId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Optional for users using third-party auth
  bio: { type: String },
  picture: { type: String }, // URL to the user's profile picture
  location: { type: String },
  portfolio: { type: String },
  reputation: { type: Number, default: 0 },
  joinDate: { type: Date, default: Date.now },
  savedPosts: [{ type: Schema.Types.ObjectId, ref: "Question" }], // Reference to saved posts
});

// Create and export the User model
const User = models.User || model<IUser>("User", UserSchema);

export default User;
