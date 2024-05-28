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
    // const userQuestionIds = await Question.find({ author: user._id }).distinct(
    //   "_id"
    // );

    await Question.deleteMany({ author: user._id });
    const deletedUser = await User.findOneAndDelete(user._id);
    revalidatePath("/community");
    return deletedUser;
  } catch (err) {
    console.log(err);
  }
}
