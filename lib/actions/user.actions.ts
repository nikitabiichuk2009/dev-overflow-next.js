"use server";

import User from "@/database/user.model";
import { connectToDB } from "../mongose";
import {
  CreateUserParams,
  DeleteUserParams,
  UpdateUserParams,
  GetAllUsersParams,
  GetSavedQuestionsParams,
  ToggleSaveQuestionParams,
  GetUserStatsParams,
  GetUserByIdParams,
} from "./shared.types";
import { revalidatePath } from "next/cache";
import Question from "@/database/question.model";
import Answer from "@/database/asnwer.model";
import Tag from "@/database/tag.model";
import { FilterQuery, SortOrder } from "mongoose";

export async function getAllUsers(params: GetAllUsersParams) {
  try {
    await connectToDB();
    const { searchQuery, page = 1, pageSize = 10, filter } = params;

    const query: FilterQuery<typeof User> = {};
    if (searchQuery) {
      query.$or = [
        { name: { $regex: searchQuery, $options: "i" } },
        { username: { $regex: searchQuery, $options: "i" } },
      ];
    }

    let sortOption: { [key: string]: SortOrder } = { joinDate: -1 }; // Default sort by newest
    if (filter === "old_users") {
      sortOption = { joinDate: 1 };
    } else if (filter === "new_users") {
      sortOption = { joinDate: -1 };
    } else if (filter === "top_contributors") {
      sortOption = { reputation: -1 };
    }

    const users = await User.find(query)
      .sort(sortOption)
      .skip((page - 1) * pageSize)
      .limit(pageSize);
    return { users };
  } catch (err) {
    console.log(err);
    throw new Error("Failed to fetch users");
  }
}

export async function getUserQuestions(params: GetUserStatsParams) {
  try {
    await connectToDB();
    const { userId, page = 1, pageSize = 10 } = params;
    const skip = (page - 1) * pageSize;
    const questions = await Question.find({ author: userId })
      .populate("tags")
      .populate("author")
      .sort({ views: -1, upvotes: -1 })
      .skip(skip)
      .limit(pageSize)
      .exec();

    return questions;
  } catch (error) {
    console.error("Error fetching user questions:", error);
    throw new Error("Error fetching user questions");
  }
}

export async function getUserAnswers(params: GetUserStatsParams) {
  try {
    await connectToDB();
    const { userId, page = 1, pageSize = 10 } = params;
    const skip = (page - 1) * pageSize;
    const answers = await Answer.find({ author: userId })
      .populate({
        path: "question",
        populate: {
          path: "tags",
        },
      })
      .populate("author")
      .sort({ createdAt: -1, upvotes: -1 })
      .skip(skip)
      .limit(pageSize)
      .exec();

    return answers;
  } catch (error) {
    console.error("Error fetching user answers:", error);
    throw new Error("Error fetching user answers");
  }
}

export async function getUserTags(params: GetUserStatsParams) {
  try {
    await connectToDB();
    const { userId } = params;
    let tags = await Tag.find({ followers: userId }).exec();
    tags = tags.sort((a, b) => b.questions.length - a.questions.length);
    return tags;
  } catch (error) {
    console.error("Error fetching user tags:", error);
    throw new Error("Error fetching user tags");
  }
}

export async function getUserById(params: GetUserByIdParams) {
  try {
    await connectToDB();
    const { userId } = params;

    // Find the user by clerkId
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      throw new Error("User not found");
    }

    // Count the number of questions posted by the user
    const questionsCount = await Question.countDocuments({ author: user._id });

    // Count the number of answers posted by the user
    const answersCount = await Answer.countDocuments({ author: user._id });

    return {
      ...user.toObject(),
      questionsCount,
      answersCount,
    };
  } catch (err) {
    console.log(err);
    throw new Error("Error fetching user data");
  }
}

export async function createUser(userData: CreateUserParams) {
  try {
    await connectToDB();

    const newUser = await User.create(userData);
    revalidatePath("/community");
    revalidatePath("/");
    return newUser;
  } catch (err) {
    console.log(err);
  }
}

export async function updateUser(userData: UpdateUserParams) {
  try {
    await connectToDB();
    const { clerkId, updateData, path } = userData;
    await User.findOneAndUpdate({ clerkId }, updateData, {
      new: true,
    });
    revalidatePath("/community");
    revalidatePath("/");
    revalidatePath(path);
  } catch (err) {
    console.log(err);
  }
}

export async function deleteUser(userData: DeleteUserParams) {
  try {
    await connectToDB();
    const { clerkId } = userData;
    const user = await User.findOne({ clerkId });

    if (!user) {
      throw new Error("User not found!");
    }

    // Find all questions authored by the user
    const userQuestionIds = await Question.find({ author: user._id }).distinct(
      "_id"
    );
    console.log("User Question IDs:", userQuestionIds);

    // Find all answers authored by the user
    const userAnswerIds = await Answer.find({ author: user._id }).distinct(
      "_id"
    );
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
    console.log(
      "Questions Updated to Remove Answer References:",
      questionsUpdated
    );

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

export async function saveQuestion(params: ToggleSaveQuestionParams) {
  try {
    await connectToDB();
    const { userId, questionId, hasSaved, path } = params;

    // Find the user and update the savedPosts field accordingly
    const update = hasSaved
      ? { $pull: { savedPosts: questionId } }
      : { $addToSet: { savedPosts: questionId } };

    const user = await User.findByIdAndUpdate(userId, update, { new: true });

    if (!user) {
      throw new Error("User not found!");
    }

    revalidatePath(path);
  } catch (err) {
    console.log(err);
    throw new Error("Error saving post.");
  }
}

export async function getSavedQuestions(params: GetSavedQuestionsParams) {
  try {
    await connectToDB();
    const { clerkId, searchQuery, page = 1, pageSize = 10, filter } = params;
    const query: FilterQuery<typeof User> = {};
    if (searchQuery) {
      query.$or = [
        { title: { $regex: searchQuery, $options: "i" } },
        { content: { $regex: searchQuery, $options: "i" } },
      ];
    }

    let sortOption: { [key: string]: SortOrder } = {};
    if (filter === "most_viewed") {
      sortOption = { views: -1 };
    } else if (filter === "most_answered") {
      sortOption = { answers: -1 };
    } else if (filter === "most_voted") {
      sortOption = { upvotes: -1 };
    } else if (filter === "most_recent") {
      sortOption = { createdAt: -1 };
    } else if (filter === "oldest") {
      sortOption = { createdAt: 1 };
    }

    // Find the user by clerkId and populate the savedPosts field
    const user = await User.findOne({ clerkId });
    if (!user) {
      throw new Error("User not found!");
    }

    const savedPosts = await User.populate(user, {
      path: "savedPosts",
      match: query,
      options: {
        sort: sortOption,
        skip: (page - 1) * pageSize,
        limit: pageSize,
      },
      populate: [
        { path: "author", model: "User" },
        { path: "tags", model: "Tag" },
      ],
    });

    const savedQuestions = savedPosts.savedPosts;
    // Return the saved questions
    return { savedQuestions };
  } catch (err) {
    console.log(err);
    throw new Error("Error fetching saved questions.");
  }
}
