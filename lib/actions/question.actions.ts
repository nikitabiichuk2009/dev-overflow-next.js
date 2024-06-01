"use server";

import Question from "@/database/question.model";
import { connectToDB } from "../mongose";
import Tag from "@/database/tag.model";
import {
  GetQuestionsParams,
  CreateQuestionParams,
  GetQuestionByIdParams,
  QuestionVoteParams,
} from "./shared.types";
import User from "@/database/user.model";
import { revalidatePath } from "next/cache";
import mongoose from "mongoose";

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

export async function getPopularQuestions() {
  try {
    connectToDB();
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

export async function getQuestionById(params: GetQuestionByIdParams) {
  try {
    connectToDB();
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

export async function upvoteQuestion(params: QuestionVoteParams) {
  try {
    connectToDB();
    const { questionId, userId, path, hasupVoted } = params;
    const questionObjectId = new mongoose.Types.ObjectId(questionId);
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const question = await Question.findById(questionObjectId);
    const user = await User.findById(userObjectId);

    if (!question || !user) {
      throw new Error('Question or User not found');
    }

    // Check if the user has already upvoted the question
    if (hasupVoted) {
      // Remove upvote
      await Question.updateOne(
        { _id: questionObjectId },
        { $pull: { upvotes: userObjectId } }
      );
    } else {
      // Add upvote and remove downvote if present
      await Question.updateOne(
        { _id: questionObjectId },
        {
          $addToSet: { upvotes: userObjectId },
          $pull: { downvotes: userObjectId }
        }
      );
    }

    revalidatePath(path);
  } catch (err) {
    console.log(err);
    throw new Error("Error updating upvotes for a question");
  }
}

export async function downvoteQuestion(params: QuestionVoteParams) {
  try {
    connectToDB();
    const { questionId, userId, path, hasdownVoted } = params;
    const questionObjectId = new mongoose.Types.ObjectId(questionId);
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const question = await Question.findById(questionObjectId);
    const user = await User.findById(userObjectId);

    if (!question || !user) {
      throw new Error('Question or User not found');
    }

    // Check if the user has already downvoted the question
    if (hasdownVoted) {
      // Remove downvote
      await Question.updateOne(
        { _id: questionObjectId },
        { $pull: { downvotes: userObjectId } }
      );
    } else {
      // Add downvote and remove upvote if present
      await Question.updateOne(
        { _id: questionObjectId },
        {
          $addToSet: { downvotes: userObjectId },
          $pull: { upvotes: userObjectId }
        }
      );
    }

    revalidatePath(path);
  } catch (err) {
    console.log(err);
    throw new Error("Error updating downvotes for a question");
  }
}
