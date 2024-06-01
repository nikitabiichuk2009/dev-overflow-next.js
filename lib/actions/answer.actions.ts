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

export async function getAllAnswers(params: GetAnswersParams) {
  const { questionId } = params;
  try {
    connectToDB();
    const answers = await Answer.find({ question: questionId })
      .populate({ path: "author", model: User })
      .sort({ createdAt: 1 });
    return { answers };
  } catch (err) {
    console.log(err);
    throw new Error("Failed to fetch answers");
  }
}

export async function createAnswer(params: CreateAnswerParams) {
  try {
    connectToDB();
    const { author, content, question, path } = params;
    // Create a new answer
    const newAnswer = await Answer.create({
      author,
      content,
      question,
    });

    // Add the answer ID to the question's answers array
    await Question.findByIdAndUpdate(question, {
      $push: { answers: newAnswer._id },
    });

    // TODO: add interaction...
    revalidatePath(path);
  } catch (err) {
    console.log(err);
    throw new Error("Failed to create an answer");
  }
}

export async function deleteAnswerById(params: DeleteAnswerParams) {
  const { answerId, path } = params;
  try {
    connectToDB();
    // Find and delete the answer
    const deletedAnswer = await Answer.findByIdAndDelete(answerId);
    if (!deletedAnswer) {
      throw new Error("Answer not found");
    }

    // Remove the answer ID from the question's answers array
    await Question.findByIdAndUpdate(deletedAnswer.question, {
      $pull: { answers: deletedAnswer._id },
    });

    revalidatePath(path);
    return { success: true, message: "Answer deleted successfully" };
  } catch (err) {
    console.log(err);
    throw new Error("Failed to delete the answer");
  }
}

export async function upvoteAnswer(params: AnswerVoteParams) {
  try {
    connectToDB();
    const { answerId, userId, path, hasupVoted } = params;
    const answerObjectId = new mongoose.Types.ObjectId(answerId);
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const answer = await Answer.findById(answerObjectId);
    const user = await User.findById(userObjectId);

    if (!answer || !user) {
      throw new Error('Answer or User not found');
    }

    // Check if the user has already upvoted the answer
    if (hasupVoted) {
      // Remove upvote
      await Answer.updateOne(
        { _id: answerObjectId },
        { $pull: { upvotes: userObjectId } }
      );
    } else {
      // Add upvote and remove downvote if present
      await Answer.updateOne(
        { _id: answerObjectId },
        {
          $addToSet: { upvotes: userObjectId },
          $pull: { downvotes: userObjectId }
        }
      );
    }

    revalidatePath(path);
  } catch (err) {
    console.log(err);
    throw new Error("Error updating upvotes for an answer");
  }
}

export async function downvoteAnswer(params: AnswerVoteParams) {
  try {
    connectToDB();
    const { answerId, userId, path, hasdownVoted } = params;
    const answerObjectId = new mongoose.Types.ObjectId(answerId);
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const answer = await Answer.findById(answerObjectId);
    const user = await User.findById(userObjectId);

    if (!answer || !user) {
      throw new Error('Answer or User not found');
    }

    // Check if the user has already downvoted the answer
    if (hasdownVoted) {
      // Remove downvote
      await Answer.updateOne(
        { _id: answerObjectId },
        { $pull: { downvotes: userObjectId } }
      );
    } else {
      // Add downvote and remove upvote if present
      await Answer.updateOne(
        { _id: answerObjectId },
        {
          $addToSet: { downvotes: userObjectId },
          $pull: { upvotes: userObjectId }
        }
      );
    }

    revalidatePath(path);
  } catch (err) {
    console.log(err);
    throw new Error("Error updating downvotes for an answer");
  }
}