"use client";
import { getTimestamp } from '@/lib/utils';
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import ParseHtml from '../shared/ParseHtml';
import { Button } from '../ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { deleteAnswerById } from '@/lib/actions/answer.actions';
import { useToast } from '@chakra-ui/react';
import NoResults from '../shared/NoResults';
import Votes from '../shared/Votes';

interface IAuthor {
  _id: string;
  clerkId: string;
  name: string;
  username: string;
  email: string;
  picture: string;
  reputation: number;
  savedPosts: string[];
  joinDate: string;
  __v: number;
}

const AnswerCard = ({ author, questionId, answerId, upvotes, downvotes, createdAt, userId, content }: { questionId: string, upvotes: string[], downvotes: string[], answerId: string, userId: string, author: IAuthor, createdAt: Date, content: string }) => {
  const toast = useToast();
  const [error, setError] = useState("")
  const handleDeleteAnswer = async () => {
    try {
      await deleteAnswerById({ answerId, path: `/question/${questionId}` });
      toast({
        title: 'Your answer deleted successfully.',
        status: 'success',
        isClosable: true,
      })
    } catch (error) {
      console.error("Failed to delete answer:", error);
      setError("Error occurred")
    }
  }

  if (error) {
    return (
      <NoResults
        title="Error deleting your answer"
        description="There was an error while deleting your answer.Try to reload the page or press the button to go back. If that didn't help, Please try again later."
        buttonTitle='Go back'
        href='../'
      />
    );
  }
  return (
    <article className='light-border border-b py-10'>
      <div className='flex items-center justify-between'>
        <div className='mb-4 flex flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center'>
          <Link href={`/profile/${author?.clerkId}`} className='flex flex-1 items-start gap-2 sm:items-center'>
            <div className='relative size-8'>
              <Image src={author?.picture} alt="user's avatar" layout="fill" className='max:sm:mt-0.5 rounded-full object-cover' />
            </div>
            <div className='flex flex-col sm:flex-row sm:items-center'>
              <p className='paragraph-semibold text-dark300_light700'>{author.name}</p>
              <p className='small-regular text-light400_light500 ml-0.5 mt-0.5 line-clamp-1'>&nbsp;- answered&nbsp;{getTimestamp(createdAt)}</p>
            </div>
          </Link>
          <div className='flex justify-end'>
            <Votes
              type="answer"
              itemId={answerId}
              userId={userId}
              upvotes={upvotes.length}
              hasUpvoted={upvotes.includes(userId)}
              downvotes={downvotes.length}
              hasDownvoted={downvotes.includes(userId)}
            />
          </div>
        </div>
      </div>
      {userId === author._id &&
        <AlertDialog>
          <AlertDialogTrigger className='mb-4 w-full sm:w-fit'>
            <Button className='w-full bg-primary-500 px-4 py-3 font-semibold !text-light-900 shadow-md transition-colors duration-300 ease-out hover:bg-[#FC4100] dark:shadow-none '>Delete Answer</Button>
          </AlertDialogTrigger>
          <AlertDialogContent className='background-light900_dark300 border-none'>
            <AlertDialogHeader>
              <AlertDialogTitle className='text-dark300_light900'>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription className='font-spaceGrotesk text-[14px] font-normal leading-[19.6px] text-light-500'>
                This action cannot be undone. This will permanently delete your answer.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className='mb-2 me-2 rounded-lg border-none bg-[#FFF7FC] px-5 py-2.5 text-sm font-medium text-gray-900 transition-colors duration-300 ease-out hover:bg-gray-100 hover:text-blue-700 focus:outline-none  dark:bg-gray-800 dark:text-gray-400  dark:hover:bg-gray-700 dark:hover:text-white'>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteAnswer} className='bg-primary-500 px-4 py-3 font-semibold !text-light-900 shadow-md transition-colors duration-300 ease-out hover:bg-[#FF6000] dark:shadow-none'>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>}
      <ParseHtml data={content} />
    </article>
  )
}

export default AnswerCard
