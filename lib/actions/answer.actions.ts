"use server";
import Answer from "@/database/asnwer.model";
import {
  AnswerVoteParams,
  CreateAnswerParams,
  DeleteAnswerParams,
  GetAnswersParams,
} from "./shared.types";
import { revalidatePath } from "next/cache";
import { connectToDB } from "../mongose";
import Question from "@/database/question.model";
import User from "@/database/user.model";
import mongoose, { Error } from "mongoose";
import Interaction from "@/database/interaction.model";

export async function getAllAnswers(params: GetAnswersParams) {
  const { questionId, sortBy = "recent", page = 1, pageSize = 5 } = params;
  try {
    await connectToDB();
    const skip = (page - 1) * pageSize;

    // Ensure questionId is an ObjectId
    const questionObjectId = new mongoose.Types.ObjectId(questionId);

    const totalAnswers = await Answer.countDocuments({
      question: questionObjectId,
    });

    // Determine sorting option based on sortBy parameter
    let sortOption = {}; // Default sort by most recent
    switch (sortBy) {
      case "lowestUpvotes":
        sortOption = { upvotesCount: 1 };
        break;
      case "highestUpvotes":
        sortOption = { upvotesCount: -1 };
        break;
      case "recent":
        sortOption = { createdAt: -1 };
        break;
      case "old":
        sortOption = { createdAt: 1 };
        break;

      default:
        break;
    }

    const aggregationPipeline = [
      { $match: { question: questionObjectId } },
      {
        $addFields: {
          upvotesCount: { $size: "$upvotes" },
        },
      },
      { $sort: sortOption },
      { $skip: skip },
      { $limit: pageSize },
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "author",
        },
      },
      { $unwind: "$author" },
    ];

    const answers = await Answer.aggregate(aggregationPipeline);
    const hasNextPage = totalAnswers > skip + answers.length;

    return { answers, isNext: hasNextPage };
  } catch (err) {
    console.log(err);
    throw new Error("Failed to fetch answers");
  }
}

export async function createAnswer(params: CreateAnswerParams) {
  try {
    await connectToDB();
    const { author, content, question, path } = params;
    // Create a new answer
    const newAnswer = await Answer.create({
      author,
      content,
      question,
    });

    // Add the answer ID to the question's answers array
    const question1 = await Question.findByIdAndUpdate(question, {
      $push: { answers: newAnswer._id },
    });

    await Interaction.create({
      user: author,
      action: "answer",
      answer: newAnswer._id,
      question,
      tags: question1.tags
    });

    await User.findByIdAndUpdate(author, {
      $inc: { reputation: 10 },
    });

    revalidatePath(path);
  } catch (err) {
    console.log(err);
    throw new Error("Failed to create an answer");
  }
}

export async function deleteAnswerById(params: DeleteAnswerParams) {
  const { answerId, path } = params;
  try {
    await connectToDB();

    // Find and delete the answer
    const deletedAnswer = await Answer.findByIdAndDelete(answerId);
    if (!deletedAnswer) {
      throw new Error("Answer not found");
    }

    // Remove the answer ID from the question's answers array
    await Question.findByIdAndUpdate(deletedAnswer.question, {
      $pull: { answers: deletedAnswer._id },
    });

    // Delete all interactions related to the answer
    await Interaction.deleteMany({ answer: deletedAnswer._id });

    revalidatePath(path);
    return { success: true, message: "Answer deleted successfully" };
  } catch (err) {
    console.log(err);
    throw new Error("Failed to delete the answer and related interactions");
  }
}

export async function upvoteAnswer(params: AnswerVoteParams) {
  try {
    await connectToDB();

    const { answerId, userId, path, hasupVoted } = params;
    const answerObjectId = new mongoose.Types.ObjectId(answerId);
    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Find the answer and user documents
    const answer = await Answer.findById(answerObjectId);
    const user = await User.findById(userObjectId);

    // If either the answer or user is not found, throw an error
    if (!answer || !user) {
      throw new Error("Answer or User not found");
    }

    // Determine the update operation based on whether the user has already upvoted
    const update = hasupVoted
      ? { $pull: { upvotes: userObjectId } } // Remove upvote
      : {
          $addToSet: { upvotes: userObjectId },
          $pull: { downvotes: userObjectId },
        }; // Add upvote and remove downvote if present

    // Update the answer document and return the updated document
    await Answer.findByIdAndUpdate(answerObjectId, update, { new: true });

    // Increment the reputation of the user who upvoted or downvoted the answer by 2
    await User.findByIdAndUpdate(userId, {
      $inc: { reputation: hasupVoted ? -2 : 2 },
    });

    // Check if the author of the answer is the same user who upvoted or downvoted
    if (answer.author.toString() === userId.toString()) {
      // If the same, do not increment the reputation of the author further (no additional increment needed)
    } else {
      // If different, increment the reputation of the answer's author by 10
      await User.findByIdAndUpdate(answer.author, {
        $inc: { reputation: hasupVoted ? -10 : 10 },
      });
    }

    // Revalidate the path to ensure the UI is up-to-date
    revalidatePath(path);
  } catch (err) {
    // Log the error and throw a new error with a descriptive message
    console.log(err);
    throw new Error("Error updating upvotes for an answer");
  }
}

export async function downvoteAnswer(params: AnswerVoteParams) {
  try {
    await connectToDB();

    const { answerId, userId, path, hasdownVoted } = params;
    const answerObjectId = new mongoose.Types.ObjectId(answerId);
    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Find the answer and user documents
    const answer = await Answer.findById(answerObjectId);
    const user = await User.findById(userObjectId);

    // If either the answer or user is not found, throw an error
    if (!answer || !user) {
      throw new Error("Answer or User not found");
    }

    // Determine the update operation based on whether the user has already downvoted
    const update = hasdownVoted
      ? { $pull: { downvotes: userObjectId } } // Remove downvote
      : {
          $addToSet: { downvotes: userObjectId },
          $pull: { upvotes: userObjectId },
        }; // Add downvote and remove upvote if present

    // Update the answer document and return the updated document
    await Answer.findByIdAndUpdate(answerObjectId, update, { new: true });


    // Decrement the reputation of the user who downvoted by 3
    await User.findByIdAndUpdate(userId, {
      $inc: { reputation: hasdownVoted ? 3 : -3 },
    });

    // Check if the author of the answer is the same user who downvoted
    if (answer.author.toString() === userId.toString()) {
      // If the same, do not decrement the reputation of the author further (no additional decrement needed)
    } else {
      // If different, decrement the reputation of the answer's author by 6
      await User.findByIdAndUpdate(answer.author, {
        $inc: { reputation: hasdownVoted ? 6 : -6 },
      });
    }

    // Revalidate the path to ensure the UI is up-to-date
    revalidatePath(path);
  } catch (err) {
    // Log the error and throw a new error with a descriptive message
    console.log(err);
    throw new Error("Error updating downvotes for an answer");
  }
}
