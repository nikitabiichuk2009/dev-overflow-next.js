'use client';
import React, { useEffect, useRef, useState } from 'react'
import { Form, FormDescription, FormField, FormItem, FormMessage } from '../ui/form'
import { useForm } from 'react-hook-form'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { AnswerShema } from '@/lib/validations'
import { Editor } from '@tinymce/tinymce-react';
import { FormControl, useToast } from '@chakra-ui/react';
import { useTheme } from '@/context/ThemeProvider';
import { Button } from '../ui/button';
import Image from 'next/image';
import NoResults from '../shared/NoResults';
import { createAnswer } from '@/lib/actions/answer.actions';
import { usePathname, useRouter } from 'next/navigation';


const AnswerForm = ({ authorId, question, questionId }: { authorId: string, question: string, questionId: string }) => {
  const path = usePathname();
  const router = useRouter();
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittingAI, setIsSubmittingAI] = useState(false);
  const [aiError, setAIError] = useState(false);
  const [error, setError] = useState("")
  const { mode } = useTheme()
  const [editorKey, setEditorKey] = useState(0);

  const form = useForm<z.infer<typeof AnswerShema>>({
    resolver: zodResolver(AnswerShema),
    defaultValues: {
      answer: ""
    },
  });
  const editorRef = useRef(null);


  useEffect(() => {
    setEditorKey(prevKey => prevKey + 1); // Update the editor key to re-render the editor when the mode changes
  }, [mode]);



  const onSubmit = async (values: z.infer<typeof AnswerShema>) => {
    if (!authorId) {
      router.push("/sign-in")
      toast({
        title: 'You must log in to post an answer.',
        status: 'info',
        isClosable: true,
      })
    }
    setIsSubmitting(true)
    try {
      await createAnswer({
        author: authorId,
        question: questionId,
        content: values.answer,
        path
      })
      form.reset();
      if (editorRef.current) {
        const editor = editorRef.current as any;
        editor.setContent("");
      }
      setError("")
      setIsSubmitting(false)
      toast({
        title: 'Successfully posted your answer',
        status: 'success',
        isClosable: true,
      })
    } catch (err) {
      console.log(err)
      setError("Error occured while creating an answer!")
      setIsSubmitting(false)
    }
  }

  const generateAIAnswer = async () => {
    if (!authorId) {
      router.push("/sign-in")
      toast({
        title: 'You must log in to generate an AI answer.',
        status: 'info',
        isClosable: true,
      })
    }
    try {
      setIsSubmittingAI(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/chatgpt`, {
        method: "POST",
        body: JSON.stringify({ question })
      });
      const aiAnswer = await response.json();
      const formattedAiAnswer = aiAnswer.reply
        .replace(/\n/g, "<br />")
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/__(.*?)__/g, "<u>$1</u>")
        .replace(/\*(.*?)\*/g, "<em>$1</em>")
        ;
      if (editorRef.current && formattedAiAnswer) {
        const editor = editorRef.current as any;
        editor.setContent(formattedAiAnswer);
        setIsSubmittingAI(false);
        toast({
          title: "Successfuly generated an AI answer.",
          isClosable: true,
          status: 'success',
        })
      }
    } catch (err) {
      console.log(err);
      setIsSubmittingAI(false)
      setAIError(true);
    }
  }



  if (error) {
    return (
      <NoResults
        title="Error submitting answer"
        description="There was an error while submitting your answer.Try to reload the page or press the button to go back. If that didn't help, Please try again later."
        buttonTitle='Go back'
        href='../'
      />
    )
  }

  return (
    <div>
      <div className='mt-6 flex flex-col justify-between gap-5 sm:flex-row sm:items-center sm:gap-2'>
        <h4 className="text-dark400_light800 text-[16px] font-semibold leading-[20.8px]">
          Write your answer here
        </h4>
        <Button onClick={generateAIAnswer} disabled={isSubmittingAI || aiError} className='btn light-border-2 gap-1.5 rounded-md px-4 py-2.5 text-primary-500 shadow-none'>
          <Image src="/assets/icons/stars.svg" alt="Star" width={12} height={12} className='object-contain' />
          {aiError ? <span className='text-red-500'>Error generating an AI answer</span> : isSubmittingAI ? "Generating..." : "Generate an AI answer"}
        </Button>
      </div>
      <Form {...form}>
        <form className='flex w-full flex-col gap-10' onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="answer"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-3">
                <FormControl className="mt-3.5">
                  <Editor
                    key={editorKey} // Ensure the editor re-initializes when the mode changes
                    apiKey={process.env.NEXT_PUBLIC_TINY_EDITOR_API_KEY}
                    onInit={(evt, editor) => {
                      // @ts-ignore
                      editorRef.current = editor
                    }}
                    onBlur={field.onBlur}
                    onEditorChange={(content) => field.onChange(content)}
                    initialValue=""
                    init={{
                      height: 350,
                      menubar: false,
                      plugins: [
                        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                        'anchor', 'searchreplace', 'visualblocks', 'codesample', 'fullscreen',
                        'insertdatetime', 'media', 'table',
                      ],
                      toolbar: 'undo redo | blocks | ' +
                        'codesample | bold italic forecolor | alignleft aligncenter ' +
                        'alignright alignjustify | bullist numlist',
                      content_style: 'body { font-family:Inter; font-size:16px }',
                      skin: mode === 'dark' ? 'oxide-dark' : 'oxide',
                      content_css: mode === 'dark' ? 'dark' : 'light',
                    }}
                  />
                </FormControl>
                <FormDescription className="mt-2.5 font-spaceGrotesk text-[14px] font-normal leading-[19.6px] text-light-500">
                  Provide a clear and comprehensive answer to the problem described. Make sure your answer is detailed and includes any necessary explanations or examples. Aim for at least 50 characters to ensure your response is meaningful and helpful.
                </FormDescription>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting} className='min-h-[46px] w-full bg-primary-500 px-4 py-3 font-semibold !text-light-900 shadow-md transition-colors duration-300 ease-out hover:bg-[#FF6000] dark:shadow-none sm:w-fit'>
              {isSubmitting ? "Submitting..." : "Submit Answer"}
            </Button>
          </div>
        </form>
      </Form>
    </div>

  )
}

export default AnswerForm
