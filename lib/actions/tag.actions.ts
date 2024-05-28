import Tag from "@/database/tag.model";
import { connectToDB } from "../mongose";
import { GetTopInteractedTagsParams } from "./shared.types";

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
