"use client";
import React, { useEffect, useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { QuestionsSchema } from "@/lib/validations";
import { Badge } from "../ui/badge";
import Image from "next/image";
import { useTheme } from "@/context/ThemeProvider";
import { createQuestion, editQuestion } from "@/lib/actions/question.actions";
import { useRouter } from "next/navigation";
import NoResults from "../shared/NoResults";
import { useToast } from "@chakra-ui/react";

const QuestionForm = ({
  mongoUserId,
  initialValues,
  type,
}: {
  mongoUserId?: string;
  type: string;
  initialValues?: any;
}) => {
  const router = useRouter();
  const toast = useToast();
  const { mode } = useTheme();
  const [editorKey, setEditorKey] = useState(0);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const editorRef = useRef(null);
  const [editorValue, setEditorValue] = useState("");
  const form = useForm<z.infer<typeof QuestionsSchema>>({
    resolver: zodResolver(QuestionsSchema),
    defaultValues: {
      title: initialValues?.title || "",
      explanation: initialValues?.explanation || "",
      tags: initialValues?.tags
        ? initialValues.tags.map((tag: any) => tag.name)
        : [],
    },
  });

  async function onSubmit(values: z.infer<typeof QuestionsSchema>) {
    if (type === "edit") {
      setIsSubmitting(true);
      try {
        await editQuestion({
          questionId: initialValues.id,
          title: values.title,
          content: values.explanation,
          tags: values.tags,
          path: "/",
        });
        router.push("/");
        toast({
          title: "Successfully edited a question",
          status: "success",
          isClosable: true,
        });
        setIsSubmitting(false);
      } catch (err) {
        console.log(err);
        setError("Error occured while editing the question!");
        setIsSubmitting(false);
      }
    } else {
      setIsSubmitting(true);
      try {
        await createQuestion({
          title: values.title,
          content: values.explanation,
          tags: values.tags,
          author: JSON.parse(mongoUserId!),
          path: "/",
        });
        router.push("/");
        toast({
          title: "Successfully created a question",
          status: "success",
          isClosable: true,
        });
        setIsSubmitting(false);
      } catch (err) {
        console.log(err);
        setError("Error occured while posting the question!");
        setIsSubmitting(false);
      }
    }
  }
  useEffect(() => {
    setEditorKey((prevKey) => prevKey + 1); // Update the editor key to re-render the editor when the mode changes
  }, [mode]);
  const handleInputTag = (
    e: React.KeyboardEvent<HTMLInputElement>,
    field: any
  ) => {
    if (e.key === "Enter" && field.name === "tags") {
      e.preventDefault();

      const tagInput = e.target as HTMLInputElement;
      const tagValue = tagInput.value.trim().toUpperCase();

      if (tagValue !== "") {
        if (tagValue.length > 15) {
          return form.setError("tags", {
            type: "required",
            message: "Tag must be less than 15 characters.",
          });
        }

        if (!field.value.includes(tagValue as never)) {
          form.setValue("tags", [...field.value, tagValue]);
          tagInput.value = "";
          form.clearErrors("tags");
        }
      } else {
        form.trigger();
      }
    }
  };
  const handleTagRemove = (tag: string, field: any) => {
    const newtags = field.value.filter((t: string) => t !== tag);
    form.setValue("tags", newtags);
  };

  if (error) {
    return (
      <NoResults
        title="Error submitting your question"
        description="There was an error while submitting your question. Try to reload the page or press the button to go back. If that didn't help, Please try again later."
        buttonTitle="Go back"
        href="../"
      />
    );
  }

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full flex-col gap-10"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col">
                <FormLabel className="text-dark400_light800 text-[16px] font-semibold leading-[20.8px]">
                  Question Title <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl className="mt-3.5">
                  <Input
                    className="no-focus background-light800_dark300 text-dark300_light700 
                    min-h-[56px] border text-[16px] font-normal leading-[22.4px]
                     dark:border-dark-400"
                    {...field}
                  />
                </FormControl>
                <FormDescription className="mt-2.5 font-spaceGrotesk text-[14px] font-normal leading-[19.6px] text-light-500">
                  Be specific and imagine you are asking a question to another
                  person.
                </FormDescription>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="explanation"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-3">
                <FormLabel className="text-dark400_light800 text-[16px] font-semibold leading-[20.8px]">
                  Detailed explanation of your problem{" "}
                  <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl className="mt-3.5">
                  <Editor
                    key={editorKey}
                    apiKey={process.env.NEXT_PUBLIC_TINY_EDITOR_API_KEY}
                    value={editorValue}
                    onInit={(evt, editor) => {
                      // @ts-ignore
                      editorRef.current = editor;
                      editor.setContent(field.value);
                    }}
                    onBlur={field.onBlur}
                    onEditorChange={(content) => {
                      field.onChange(content);
                      setEditorValue(content);
                    }}
                    initialValue={field.value}
                    init={{
                      height: 350,
                      menubar: false,
                      plugins: [
                        "advlist",
                        "autolink",
                        "lists",
                        "link",
                        "image",
                        "charmap",
                        "preview",
                        "anchor",
                        "searchreplace",
                        "visualblocks",
                        "codesample",
                        "fullscreen",
                        "insertdatetime",
                        "media",
                        "table",
                      ],
                      toolbar:
                        "undo redo | blocks | " +
                        "codesample | bold italic forecolor | alignleft aligncenter " +
                        "alignright alignjustify | bullist numlist",
                      content_style:
                        "body { font-family:Inter; font-size:16px }",
                      directionality: "ltr",
                      skin: mode === "dark" ? "oxide-dark" : "oxide",
                      content_css: mode === "dark" ? "dark" : "light",
                    }}
                  />
                </FormControl>
                <FormDescription className="mt-2.5 font-spaceGrotesk text-[14px] font-normal leading-[19.6px] text-light-500">
                  Introduce the problem and expand what you put in the title. At
                  least 20 characters.
                </FormDescription>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col">
                <FormLabel className="text-dark400_light800 text-[16px] font-semibold leading-[20.8px]">
                  Tags <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl className="mt-3.5">
                  <>
                    <Input
                      onKeyDown={(e) => handleInputTag(e, field)}
                      placeholder="NEXTJS, JAVASCRIPT, HTML, REACT etc..."
                      className="no-focus background-light800_dark300 text-dark300_light700
                       min-h-[56px] border text-[16px] font-normal leading-[22.4px]
                        dark:border-dark-400"
                    />
                    {field.value.length > 0 && (
                      <div className="flex-start mt-2.5 gap-2.5">
                        {field.value.map((tag: any) => {
                          return (
                            <Badge
                              onClick={() => handleTagRemove(tag, field)}
                              key={tag}
                              className="background-light800_dark300 subtle-medium text-light400_light500 flex items-center justify-center gap-2 rounded-md border-none px-4 py-2 uppercase"
                            >
                              {tag}
                              <Image
                                src="/assets/icons/close.svg"
                                alt="close"
                                width={12}
                                height={12}
                                className="cursor-pointer object-contain invert-0 dark:invert"
                              />
                            </Badge>
                          );
                        })}
                      </div>
                    )}
                  </>
                </FormControl>
                <FormDescription className="mt-2.5 font-spaceGrotesk text-[14px] font-normal leading-[19.6px] text-light-500">
                  Add up to 5 tags to describe what your question is about. You
                  need to press enter to add a tag.
                </FormDescription>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="min-h-[46px] w-full bg-primary-500 px-4 py-3 font-semibold !text-light-900 shadow-md transition-colors duration-300 ease-out hover:bg-[#FF6000] dark:shadow-none sm:w-fit"
            >
              {isSubmitting ? (
                <>{type === "edit" ? "Editing..." : "Submitting..."}</>
              ) : (
                <>{type === "edit" ? "Edit Question" : "Submit Question"}</>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default QuestionForm;
