"use server";

import Question from "@/database/question.model";
import { connectToDB } from "../mongose";
import Tag from "@/database/tag.model";
import {
  GetQuestionsParams,
  CreateQuestionParams,
  GetQuestionByIdParams,
  QuestionVoteParams,
  DeleteQuestionParams,
  EditQuestionParams,
} from "./shared.types";
import User from "@/database/user.model";
import { revalidatePath } from "next/cache";
import mongoose, { FilterQuery, SortOrder } from "mongoose";
import Answer from "@/database/asnwer.model";
import Interaction from "@/database/interaction.model";

export async function getQuestions(params: GetQuestionsParams) {
  const { searchQuery, page = 1, pageSize = 10, filter } = params;
  try {
    await connectToDB();

    const query: FilterQuery<typeof Question> = {};
    if (searchQuery) {
      query.$or = [
        { title: { $regex: searchQuery, $options: "i" } },
        { content: { $regex: searchQuery, $options: "i" } },
      ];
    }

    let sortOption: { [key: string]: SortOrder } = { createdAt: 1 }; // Default sort by newest
    if (filter === "frequent") {
      sortOption = { views: -1 }; // Sort by most viewed
    } else if (filter === "unanswered") {
      query.answers = { $size: 0 }; // Filter for unanswered questions
    } else if (filter === "newest") {
      sortOption = { createdAt: -1 }; // Sort by most recent
    }

    const questions = await Question.find(query)
      .populate({ path: "tags", model: Tag })
      .populate({ path: "author", model: User })
      .sort(sortOption)
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    return { questions };
  } catch (err) {
    console.log(err);
    throw new Error("Failed to fetch questions");
  }
}
export async function getPopularQuestions() {
  try {
    await connectToDB();
    const questions = await Question.find({})
      .populate({ path: "tags", model: Tag })
      .populate({ path: "author", model: User })
      .sort({ createdAt: -1 })
      .limit(4);
    return { questions };
  } catch (err) {
    console.log(err);
    throw new Error("Failed to fetch popular questions");
  }
}

export async function createQuestion(params: CreateQuestionParams) {
  try {
    await connectToDB();
    const { title, content, tags, author, path } = params;

    const question = await Question.create({
      title,
      content,
      author,
      views: 0,
    });

    const tagDocuments = [];
    for (const tag of tags) {
      const existingTag = await Tag.findOne({
        name: { $regex: new RegExp(`^${tag}$`, "i") },
      });

      if (existingTag) {
        // Add question to the tag's questions list
        await Tag.findByIdAndUpdate(existingTag._id, {
          $addToSet: { questions: question._id },
        });

        // Add author to followers list only if not already a follower
        if (!existingTag.followers.includes(author)) {
          await Tag.findByIdAndUpdate(existingTag._id, {
            $addToSet: { followers: author },
          });
        }

        tagDocuments.push(existingTag._id);
      } else {
        // Create new tag if it doesn't exist and add question and author to it
        const newTag = await Tag.create({
          name: tag,
          questions: [question._id],
          followers: [author],
        });
        tagDocuments.push(newTag._id);
      }
    }

    await Question.findByIdAndUpdate(question._id, {
      $push: { tags: { $each: tagDocuments } },
    });

    // await User.findByIdAndUpdate(author, {
    //   $push: { savedPosts: question._id },
    // });

    revalidatePath(path);
  } catch (err) {
    console.log(err);
    throw new Error("Failed to create question");
  }
}

export async function editQuestion(params: EditQuestionParams) {
  try {
    await connectToDB();
    const { questionId, title, content, tags, path } = params;

    const question = await Question.findByIdAndUpdate(
      questionId,
      { title, content },
      { new: true }
    );

    if (!question) {
      throw new Error("Question not found");
    }

    const tagDocuments = [];
    for (const tag of tags) {
      const existingTag = await Tag.findOne({
        name: { $regex: new RegExp(`^${tag}$`, "i") },
      });

      if (existingTag) {
        // Add question to the tag's questions list if not already added
        if (!existingTag.questions.includes(question._id)) {
          await Tag.findByIdAndUpdate(existingTag._id, {
            $addToSet: { questions: question._id },
          });
        }

        tagDocuments.push(existingTag._id);
      } else {
        // Create new tag if it doesn't exist and add question to it
        const newTag = await Tag.create({
          name: tag,
          questions: [question._id],
        });
        tagDocuments.push(newTag._id);
      }
    }

    // Remove the question from tags that are not in the new tags list
    await Tag.updateMany(
      { questions: question._id, _id: { $nin: tagDocuments } },
      { $pull: { questions: question._id } }
    );

    // Update the question's tags
    await Question.findByIdAndUpdate(question._id, {
      $set: { tags: tagDocuments },
    });

    revalidatePath(path);
  } catch (err) {
    console.log(err);
    throw new Error("Failed to edit question");
  }
}

export async function getQuestionById(params: GetQuestionByIdParams) {
  try {
    await connectToDB();
    const { questionId } = params;
    const question = await Question.findById(questionId)
      .populate({ path: "tags", model: Tag })
      .populate({ path: "author", model: User });
    return question;
  } catch (err) {
    console.log(err);
    throw new Error("Failed to load specific question");
  }
}

export async function deleteQuestionById(params: DeleteQuestionParams) {
  const { questionId, path } = params;
  try {
    await connectToDB();
    // Find and delete the question
    const deletedQuestion = await Question.findByIdAndDelete(questionId);
    if (!deletedQuestion) {
      throw new Error("Question not found");
    }

    // Delete all answers related to the question
    await Answer.deleteMany({ question: questionId });

    // Delete all interactions related to the question
    await Interaction.deleteMany({ question: questionId });

    // Update tags by removing references to the deleted question
    await Tag.updateMany(
      { questions: questionId },
      { $pull: { questions: questionId } }
    );

    // Delete tags that no longer have any questions associated with them
    await Tag.deleteMany({ questions: { $size: 0 } });

    revalidatePath(path);
    return { success: true, message: "Question deleted successfully" };
  } catch (err) {
    console.log(err);
    throw new Error("Failed to delete the question and related data");
  }
}

export async function upvoteQuestion(params: QuestionVoteParams) {
  try {
    await connectToDB();

    const { questionId, userId, path, hasupVoted } = params;
    const questionObjectId = new mongoose.Types.ObjectId(questionId);
    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Determine the update operation based on whether the user has already upvoted
    const update = hasupVoted
      ? { $pull: { upvotes: userObjectId } } // Remove upvote
      : {
          $addToSet: { upvotes: userObjectId },
          $pull: { downvotes: userObjectId },
        }; // Add upvote and remove downvote if present

    // Find the question by ID and apply the update, returning the updated document
    const question = await Question.findByIdAndUpdate(
      questionObjectId,
      update,
      { new: true } // Return the updated document
    );

    // If the question is not found, throw an error
    if (!question) {
      throw new Error("Question not found!");
    }

    // Revalidate the path to ensure the UI is up-to-date
    revalidatePath(path);
  } catch (err) {
    // Log the error and throw a new error with a descriptive message
    console.log(err);
    throw new Error("Error updating upvotes for the question");
  }
}

export async function downvoteQuestion(params: QuestionVoteParams) {
  try {
    // Establish a connection to the database
    await connectToDB();

    const { questionId, userId, path, hasdownVoted } = params;
    const questionObjectId = new mongoose.Types.ObjectId(questionId);
    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Determine the update operation based on whether the user has already downvoted
    const update = hasdownVoted
      ? { $pull: { downvotes: userObjectId } } // Remove downvote
      : {
          $addToSet: { downvotes: userObjectId },
          $pull: { upvotes: userObjectId },
        }; // Add downvote and remove upvote if present

    // Find the question by ID and apply the update, returning the updated document
    const question = await Question.findByIdAndUpdate(
      questionObjectId,
      update,
      { new: true } // Return the updated document
    );

    // If the question is not found, throw an error
    if (!question) {
      throw new Error("Question not found!");
    }

    // Revalidate the path to ensure the UI is up-to-date
    revalidatePath(path);
  } catch (err) {
    // Log the error and throw a new error with a descriptive message
    console.log(err);
    throw new Error("Error updating downvotes for the question");
  }
}
