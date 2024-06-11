"use server";

import Question from "@/database/question.model";
import { connectToDB } from "../mongose";
import { SearchParams } from "./shared.types";
import Answer from "@/database/asnwer.model";
import User from "@/database/user.model";
import Tag from "@/database/tag.model";

const SearchableTypes = ["question", "answer", "user", "tag"];

export async function globalSearch(params: SearchParams) {
  try {
    await connectToDB();
    const { query, type } = params;
    const regexQuery = { $regex: query, $options: "i" };
    let results = [];
    const modelsAndTypes = [
      { model: Question, searchFields: ["title", "content"], type: "question" },
      { model: Answer, searchFields: ["content"], type: "answer" },
      { model: User, searchFields: ["username", "name"], type: "user" },
      { model: Tag, searchFields: ["name"], type: "tag" },
    ];

    const typeLower = type?.toLocaleLowerCase();
    if (!typeLower || !SearchableTypes.includes(typeLower)) {
      // Search Across everything
      for (const modelInfo of modelsAndTypes) {
        const orQueries = modelInfo.searchFields.map((field) => ({
          [field]: regexQuery,
        }));

        const queryResults = await modelInfo.model
          .find({ $or: orQueries })
          .limit(2)
          .exec();

        const mappedResults = queryResults.map((item) => ({
          title:
            modelInfo.type === "answer"
              ? `Answers containing ${query}`
              : modelInfo.type === "user"
                ? `@${item[modelInfo.searchFields[0]]}`
                : item[modelInfo.searchFields[0]],
          type: modelInfo.type,
          id:
            modelInfo.type === "user"
              ? item.clerkId
              : modelInfo.type === "answer"
                ? item.question
                : item._id,
        }));

        results.push(...mappedResults);
      }
    } else {
      // Search in the specified model type
      const modelInfo = modelsAndTypes.find((item) => item.type === type);
      if (!modelInfo) {
        throw new Error("Invalid search type");
      }
      const orQueries = modelInfo.searchFields.map((field) => ({
        [field]: regexQuery,
      }));
      const queryResults = await modelInfo.model
        .find({ $or: orQueries })
        .limit(10)
        .exec();
      results = queryResults.map((item) => ({
        title:
          modelInfo.type === "answer"
            ? `Answers containing ${query}`
            : modelInfo.type === "user"
              ? `@${item[modelInfo.searchFields[0]]}`
              : item[modelInfo.searchFields[0]],
        type,
        id:
          modelInfo.type === "user"
            ? item.clerkId
            : modelInfo.type === "answer"
              ? item.question
              : item._id,
      }));
    }
    return JSON.stringify(results);
  } catch (error) {
    console.log();
    throw new Error("Some error occured");
  }
}
