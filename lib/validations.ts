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
    .max(5, "Please use not more than 5 tags."),
});

export const AnswerShema = z.object({
  answer: z
    .string()
    .min(50, "Please provide meaningful answer, use at least 50 characters."),
});

export const EditProfileSchema = z.object({
  bio: z
    .string()
    .optional()
    .refine((val) => !val || (val.length >= 10 && val.length <= 100), {
      message: "Bio must be between 10 and 100 characters long",
    }),
  portfolio: z
    .string()
    .optional()
    .refine((val) => !val || /^https?:\/\/[^\s/$.?#].[^\s]*$/.test(val), {
      message: "Portfolio link must be a valid URL",
    }),
  location: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 10, {
      message: "Location must be at least 10 characters long",
    }),
});
