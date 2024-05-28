"use server";

import Question from "@/database/question.model";
import { connectToDB } from "../mongose";
import Tag from "@/database/tag.model";
import { GetQuestionsParams, CreateQuestionParams } from "./shared.types";
import User from "@/database/user.model";
import { revalidatePath } from "next/cache";

export async function getQuestions(params: GetQuestionsParams) {
  try {
    connectToDB();
    const questions = await Question.find({})
      .populate({ path: "tags", model: Tag })
      .populate({ path: "author", model: User })
      .sort({ createdAt: -1 });
    return { questions };
  } catch (err) {
    console.log(err);
    throw new Error("Failed to fetch questions");
  }
}

export async function createQuestion(params: CreateQuestionParams) {
  try {
    connectToDB();
    const { title, content, tags, author, path } = params;

    const question = await Question.create({
      title,
      content,
      author,
    });
    const tagDocuments = [];
    for (const tag of tags) {
      const existingTag = await Tag.findOneAndUpdate(
        { name: { $regex: new RegExp(`^${tag}$`, "i") } },
        {
          $setOnInsert: { name: tag },
          $push: { questions: question._id, followers: author },
        },
        { new: true, upsert: true } // Create tag if it doesn't exist
      );
      tagDocuments.push(existingTag._id);
    }
    await Question.findByIdAndUpdate(question._id, {
      $push: { tags: { $each: tagDocuments } },
    });

    await User.findByIdAndUpdate(author, {
      $push: { savedPosts: question._id },
    });

    revalidatePath(path);
  } catch (err) {
    console.log(err);
    throw new Error("Failed to create question");
  }
}
