import { z } from "zod";

export const QuestionsSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters.")
    .max(130, "Title must be not more than 130 characters."),
  explanation: z
    .string()
    .min(
      20,
      "Please provide meaningful explanation, use at least 20 characters."
    ),
  tags: z
    .array(
      z
        .string()
        .min(1, "Tag must be at least 5 characters.")
        .max(20, "Tag must be not more than 20 characters.")
    )
    .min(1, "Please use at least 1 tag.")
    .max(3, "Please use not more than 3 tags."),
});