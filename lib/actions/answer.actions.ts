"use server";
import Answer from "@/database/asnwer.model";
import {
  CreateAnswerParams,
  DeleteAnswerParams,
  GetAnswersParams,
} from "./shared.types";
import { revalidatePath } from "next/cache";
import { connectToDB } from "../mongose";
import Question from "@/database/question.model";
import User from "@/database/user.model";
import { Error } from "mongoose";

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

    // Revalidate the path to update the cache
    revalidatePath(path);
    return { success: true, message: "Answer deleted successfully" };
  } catch (err) {
    console.log(err);
    throw new Error("Failed to delete the answer");
  }
}
