"use server";

import User from "@/database/user.model";
import { connectToDB } from "../mongose";
import {
  CreateUserParams,
  DeleteUserParams,
  GetUserByIdParams,
  UpdateUserParams,
  GetAllUsersParams,
} from "./shared.types";
import { revalidatePath } from "next/cache";
import Question from "@/database/question.model";
import Answer from "@/database/asnwer.model";
import Tag from "@/database/tag.model";

export async function getAllUsers(params: GetAllUsersParams) {
  try {
    await connectToDB();
    // const { page = 1, pageSize = 20, filter, searchQuery} = params;
    const users = await User.find({}).sort({ joinDate: -1 });
    return { users };
  } catch (err) {
    console.log(err);
    throw new Error("Failed to fetch users");
  }
}

export async function getUserById(params: GetUserByIdParams) {
  try {
    connectToDB();
    const { userId } = params;

    const user = await User.findOne({ clerkId: userId });
    return user;
  } catch (err) {
    console.log(err);
  }
}

export async function createUser(userData: CreateUserParams) {
  try {
    connectToDB();

    const newUser = await User.create(userData);
    revalidatePath("/community");
    return newUser;
  } catch (err) {
    console.log(err);
  }
}

export async function updateUser(userData: UpdateUserParams) {
  try {
    connectToDB();
    const { clerkId, updateData, path } = userData;
    const updatedUser = await User.findOneAndUpdate({ clerkId }, updateData, {
      new: true,
    });
    revalidatePath("/community");
    revalidatePath(path);
    return updatedUser;
  } catch (err) {
    console.log(err);
  }
}

export async function deleteUser(userData: DeleteUserParams) {
  try {
    connectToDB();
    const { clerkId } = userData;
    const user = await User.findOne({ clerkId });

    if (!user) {
      throw new Error("User not found!");
    }

    // Find all questions authored by the user
    const userQuestionIds = await Question.find({ author: user._id }).distinct('_id');
    console.log("User Question IDs:", userQuestionIds);

    // Find all answers authored by the user
    const userAnswerIds = await Answer.find({ author: user._id }).distinct('_id');
    console.log("User Answer IDs:", userAnswerIds);

    // Delete user's questions
    const questionsDeleted = await Question.deleteMany({ author: user._id });
    console.log("Questions Deleted:", questionsDeleted);

    // Delete user's answers
    const answersDeleted = await Answer.deleteMany({ author: user._id });
    console.log("Answers Deleted:", answersDeleted);

    // Update questions by removing references to deleted answers
    const questionsUpdated = await Question.updateMany(
      { answers: { $in: userAnswerIds } },
      { $pull: { answers: { $in: userAnswerIds } } }
    );
    console.log("Questions Updated to Remove Answer References:", questionsUpdated);

    // Update tags by removing references to deleted questions
    const tagsUpdated = await Tag.updateMany(
      { questions: { $in: userQuestionIds } },
      { $pull: { questions: { $in: userQuestionIds } } }
    );
    console.log("Tags Updated to Remove Question References:", tagsUpdated);

    // Delete tags that no longer have any questions associated with them
    const tagsDeleted = await Tag.deleteMany({ questions: { $size: 0 } });
    console.log("Tags Deleted:", tagsDeleted);

    // Delete the user
    const deletedUser = await User.findOneAndDelete({ _id: user._id });
    console.log("User Deleted:", deletedUser);

    revalidatePath("/");
    revalidatePath("/community");
    revalidatePath("/tags");

    return deletedUser;
  } catch (err) {
    console.log(err);
    throw new Error("Error deleting user and related data");
  }
}