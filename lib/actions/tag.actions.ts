import Tag, { ITag } from "@/database/tag.model";
import { connectToDB } from "../mongose";
import { GetTopInteractedTagsParams, GetAllTagsParams, GetQuestionsByTagIdParams } from "./shared.types";
import mongoose, { FilterQuery } from "mongoose";

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
    const tags = await Tag.aggregate([
      {
        $addFields: {
          questionsCount: { $size: "$questions" },
        },
      },
      {
        $sort: { questionsCount: -1 },
      },
    ]);
    return { tags };
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
    const { tagId, searchQuery } = params;

    // Build the query for finding the tag
    const tagFilter: FilterQuery<ITag> = { _id: new mongoose.Types.ObjectId(tagId) };

    // Find the tag and populate associated questions
    const tag = await Tag.findOne(tagFilter)
      .populate({
        path: 'questions',
        match: searchQuery
          ? { title: { $regex: searchQuery, $options: 'i' } }
          : {},
        options: { sort: { createdAt: -1 } },
        populate: [
          { path: 'author', model: 'User' },
          { path: 'tags', model: 'Tag' },
        ],
      })
      .exec();

    if (!tag) {
      throw new Error('Tag not found');
    }

    // Extract the questions from the tag
    const questions = tag.questions;

    return { tagTitle: tag.name, questions };
  } catch (err) {
    console.log(err);
    throw new Error('Failed to find questions by tag_id.');
  }
}