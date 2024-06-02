"use server";
import Question from "@/database/question.model";
import { connectToDB } from "../mongose";
import { ViewQuestionParams } from "./shared.types";
import Interaction from "@/database/interaction.model";

export async function viewQuestion(params:ViewQuestionParams) {
  try {
    await connectToDB();
    const { questionId, userId } = params;
    // Update view count for a question
    await Question.findByIdAndUpdate(questionId, { $inc: { views: 1 } });
    if (userId) {
      const existingInteraction = await Interaction.findOne({
        user: userId,
        action: "view",
        question: questionId,
      });
      if (existingInteraction) {
        return console.log('user has already view this question.')
      }
      await Interaction.create({
        user: userId,
        action: "view",
        question: questionId,
      })
    }
  } catch (err) {
    console.log(err);
    throw new Error("Failed to view a specific question.")
  }
}