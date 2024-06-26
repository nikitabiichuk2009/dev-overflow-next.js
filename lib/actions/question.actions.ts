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
  RecommendedParams,
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

    const totalQuestions = await Question.countDocuments(query);
    const hasNextPage =
      totalQuestions > (page - 1) * pageSize + questions.length;
    return { questions, isNext: hasNextPage };
  } catch (err) {
    console.log(err);
    throw new Error("Failed to fetch questions");
  }
}

export async function getRecommendedQuestions(params: RecommendedParams) {
  try {
    await connectToDB();

    const { userId, page = 1, pageSize = 20, searchQuery } = params;

    // find user
    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      throw new Error("user not found");
    }

    const skipAmount = (page - 1) * pageSize;

    // Find the user's interactions
    const userInteractions = await Interaction.find({ user: user._id })
      .populate("tags")
      .exec();
    console.log(userInteractions);
    if (userInteractions.length === 0) {
      return { questions: [], isNext: false };
    } else {
      // Extract tags from user's interactions
      const userTags = userInteractions.reduce((tags, interaction) => {
        if (interaction.tags) {
          tags = tags.concat(interaction.tags);
        }
        return tags;
      }, []);

      // Get distinct tag IDs from user's interactions
      const distinctUserTagIds = [
        // @ts-ignore
        ...new Set(userTags.map((tag: any) => tag._id)),
      ];

      const query: FilterQuery<typeof Question> = {
        $and: [
          { tags: { $in: distinctUserTagIds } }, // Questions with user's tags
          { author: { $ne: user._id } }, // Exclude user's own questions
        ],
      };

      if (searchQuery) {
        query.$or = [
          { title: { $regex: searchQuery, $options: "i" } },
          { content: { $regex: searchQuery, $options: "i" } },
        ];
      }

      const totalQuestions = await Question.countDocuments(query);

      const recommendedQuestions = await Question.find(query)
        .populate({
          path: "tags",
          model: Tag,
        })
        .populate({
          path: "author",
          model: User,
        })
        .skip(skipAmount)
        .limit(pageSize);

      const isNext = totalQuestions > skipAmount + recommendedQuestions.length;

      return { questions: recommendedQuestions, isNext };
    }
  } catch (error) {
    console.error("Error getting recommended questions:", error);
    throw error;
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

    await Interaction.create({
      user: author,
      action: "ask_question",
      question: question._id,
      tags: tagDocuments,
    });

    await User.findByIdAndUpdate(author, {
      $inc: { reputation: 5 },
    });

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

        // Add author to followers list if not already a follower
        if (!existingTag.followers.includes(question.author)) {
          await Tag.findByIdAndUpdate(existingTag._id, {
            $addToSet: { followers: question.author },
          });
        }

        tagDocuments.push(existingTag._id);
      } else {
        // Create new tag if it doesn't exist and add question and author to it
        const newTag = await Tag.create({
          name: tag,
          questions: [question._id],
          followers: [question.author], // Add the author to the followers list
        });
        tagDocuments.push(newTag._id);
      }
    }

    // Remove the question from tags that are not in the new tags list
    const tagsToRemoveFrom = await Tag.find({
      questions: question._id,
      _id: { $nin: tagDocuments },
    });

    for (const tagToRemoveFrom of tagsToRemoveFrom) {
      await Tag.findByIdAndUpdate(tagToRemoveFrom._id, {
        $pull: { questions: question._id },
      });

      // Check if the tag now has 0 questions and delete it if so
      const updatedTag = await Tag.findById(tagToRemoveFrom._id);
      if (updatedTag.questions.length === 0) {
        await Tag.findByIdAndDelete(tagToRemoveFrom._id);
      }
    }

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

    // Increment the reputation of the user who upvoted or downvoted the question by 1
    await User.findByIdAndUpdate(userId, {
      $inc: { reputation: hasupVoted ? -1 : 1 },
    });

    // Check if the author of the question is the same user who upvoted or downvoted
    if (question.author.toString() === userId.toString()) {
      // If the same, do not increment the reputation of the author further (no additional increment needed)
    } else {
      // If different, increment the reputation of the question's author by 10
      await User.findByIdAndUpdate(question.author, {
        $inc: { reputation: hasupVoted ? -10 : 10 },
      });
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

    // Decrement the reputation of the user who downvoted by 2
    await User.findByIdAndUpdate(userId, {
      $inc: { reputation: hasdownVoted ? 2 : -2 },
    });

    // Check if the author of the question is the same user who downvoted
    if (question.author.toString() === userId.toString()) {
      // If the same, do not decrement the reputation of the author further (no additional decrement needed)
    } else {
      // If different, decrement the reputation of the question's author by 5
      await User.findByIdAndUpdate(question.author, {
        $inc: { reputation: hasdownVoted ? 5 : -5 },
      });
    }

    // Revalidate the path to ensure the UI is up-to-date
    revalidatePath(path);
  } catch (err) {
    // Log the error and throw a new error with a descriptive message
    console.log(err);
    throw new Error("Error updating downvotes for the question");
  }
}
