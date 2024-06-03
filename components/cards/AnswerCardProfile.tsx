'use client';
import { formatLargeNumber, getTimestamp } from '@/lib/utils'
import React, { useState } from 'react'
import Metric from '../shared/Metric'
import Tag from '../shared/Tag'
import Link from 'next/link'
import { SignedIn, useAuth } from '@clerk/nextjs'
import Image from 'next/image'
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
import { usePathname } from 'next/navigation';

interface Props {
  questionId: string;
  answerId: string;
  title: string;
  tags: { _id: string; name: string }[];
  author: {
    _id: string,
    clerkId: string;
    name: string,
    picture: string
  };
  upvotes: Array<object>;
  downvotes: Array<object>;
  createdAt: Date;
}

const AnswerCardProfile = ({ answerId, questionId, title, tags, author, upvotes, downvotes, createdAt }: Props) => {
  const { userId } = useAuth();
  const pathName = usePathname();
  const toast = useToast();
  const [error, setError] = useState("");
  const handleDeleteAnswer = async () => {
    try {
      await deleteAnswerById({ answerId, path: pathName });
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
        title="Error deleting answer"
        description="An error occurred while attempting to delete the answer.Try to reload the page or press the button to go back. If that didn't help, Please try again later."
        buttonTitle="Go back"
        href={`../`}
      />
    );
  }
  return (
    <div className='card-wrapper rounded-[10px] p-9 sm:px-11'>
      <div className='flex flex-col-reverse items-start justify-between gap-5 sm:flex-row'>
        <div>
          <span className='small-medium text-dark400_light700 line-clamp-1 sm:hidden'>{getTimestamp(createdAt)}</span>
          <Link href={`/question/${questionId}`}>
            <h3 className='sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1'>{title}</h3>
          </Link>
        </div>
        <SignedIn>
          {userId === author.clerkId &&
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Image src="/assets/icons/trash.svg" className='cursor-pointer' alt="delete icon" height={16} width={16} />
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
        </SignedIn>
      </div>
      <div className='mt-3.5 flex flex-wrap gap-2'>
        {tags.map((tag) => {
          return <Tag key={tag._id} id={tag._id} title={tag.name}
            classNameSizeCustom="subtle-medium uppercase px-4 py-2"
            classNameBgCustom='background-light800_dark300Tag'
          />
        })}
      </div>
      <div className='flex-between mt-6 w-full flex-wrap gap-3'>
        <Metric imgUrl={author.picture} alt="user" value={author.name} title={` - answered ${getTimestamp(createdAt)}`} isAuthor href={`/profile/${author.clerkId}`} textStyles="body-medium text-dark400_light700" />
        <div className="flex items-center gap-3 max-sm:flex-wrap max-sm:justify-start">
          <Metric imgUrl="/assets/icons/like.svg" alt="upvotes" value={formatLargeNumber(upvotes.length) || 0} title={` ${upvotes.length === 1 ? "Vote" : "Votes"}`} textStyles="small-medium text-dark400_light800" />
          <Metric imgUrl="/assets/icons/dislike.svg" alt="downvotes" value={formatLargeNumber(downvotes.length) || 0} title={` ${downvotes.length === 1 ? "Downvote" : "Downvotes"}`} textStyles="small-medium text-dark400_light800" />

        </div>
      </div>

    </div>
  )
}

export default AnswerCardProfile