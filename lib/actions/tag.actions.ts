import Tag from "@/database/tag.model";
import { connectToDB } from "../mongose";
import { GetTopInteractedTagsParams, GetAllTagsParams } from "./shared.types";

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
