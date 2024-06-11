import Tag, { ITag } from "@/database/tag.model";
import { connectToDB } from "../mongose";
import {
  GetTopInteractedTagsParams,
  GetAllTagsParams,
  GetQuestionsByTagIdParams,
} from "./shared.types";
import mongoose, { FilterQuery } from "mongoose";
import Question from "@/database/question.model";

export async function getTagsByUserId(params: GetTopInteractedTagsParams) {
  const { userId, limit = 3 } = params;
  try {
    await connectToDB();
    const tags = await Tag.find({ followers: userId }).limit(limit);
    return tags;
  } catch (err) {
    console.log(err);
    throw new Error("Failed to fetch tags");
  }
}

export async function getAllTags(params: GetAllTagsParams) {
  try {
    await connectToDB();
    const { page = 1, pageSize = 10, searchQuery, filter } = params;
    const query: FilterQuery<typeof Tag> = searchQuery
      ? { name: { $regex: new RegExp(searchQuery, "i") } }
      : {};

    let sortOption = {};
    switch (filter) {
      case "popular":
        sortOption = { questionsCount: -1 };
        break;
      case "recent":
        sortOption = { createdAt: -1 };
        break;
      case "name":
        sortOption = { name: 1 };
        break;
      case "old":
        sortOption = { createdAt: 1 };
        break;
      default:
        sortOption = { questionsCount: -1 }; // Default to popular
        break;
    }

    const tags = await Tag.aggregate([
      { $match: query },
      {
        $addFields: {
          questionsCount: { $size: "$questions" },
        },
      },
      {
        $sort: sortOption,
      },
      {
        $skip: (page - 1) * pageSize,
      },
      {
        $limit: pageSize,
      },
    ]);
    const totalTags = await Tag.countDocuments(query);
    const hasNextPage = totalTags > ((page - 1) * pageSize) + tags.length;
    return { tags, isNext: hasNextPage };
  } catch (err) {
    console.log(err);
    throw new Error("Failed to fetch tags");
  }
}

export async function getPopularTags() {
  try {
    await connectToDB();
    const tags = await Tag.aggregate([
      {
        $addFields: {
          questionsCount: { $size: "$questions" },
        },
      },
      {
        $sort: { questionsCount: -1 },
      },
      {
        $limit: 5,
      },
    ]);
    return { tags };
  } catch (err) {
    console.log(err);
    throw new Error("Failed to fetch popular tags");
  }
}

export async function fetchQuestionsByTagId(params: GetQuestionsByTagIdParams) {
  try {
    await connectToDB();
    const { tagId, searchQuery, page = 1, pageSize = 10 } = params;
    const skip = (page - 1) * pageSize;

    // Build the query for finding the tag
    const tagFilter: FilterQuery<ITag> = {
      _id: new mongoose.Types.ObjectId(tagId),
    };

    const query: FilterQuery<typeof Question> = {};
    if (searchQuery) {
      query.$or = [
        { title: { $regex: searchQuery, $options: "i" } },
        { content: { $regex: searchQuery, $options: "i" } },
      ];
    }

    // Find the tag and populate associated questions with pagination
    const tag = await Tag.findOne(tagFilter)
      .populate({
        path: "questions",
        match: query,
        options: { sort: { createdAt: -1 }, skip, limit: pageSize },
        populate: [
          { path: "author", model: "User" },
          { path: "tags", model: "Tag" },
        ],
      })
      .exec();

    if (!tag) {
      throw new Error("Tag not found");
    }

    // Extract the questions from the tag
    const questions = tag.questions;

    // Check if there are more questions for next page
    const totalQuestionsCount = await Question.countDocuments({ tags: tag._id, ...query });
    const hasNextPage = totalQuestionsCount > skip + questions.length;

    return {
      tagTitle: tag.name,
      questions,
      isNext: hasNextPage,
    };
  } catch (err) {
    console.log(err);
    throw new Error("Failed to find questions by tag_id.");
  }
}
