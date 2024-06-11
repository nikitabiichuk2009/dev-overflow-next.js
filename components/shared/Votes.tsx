'use client';
import { downvoteAnswer, upvoteAnswer } from '@/lib/actions/answer.actions';
import { viewQuestion } from '@/lib/actions/interaction.actions';
import { downvoteQuestion, upvoteQuestion } from '@/lib/actions/question.actions';
import { AnswerVoteParams, QuestionVoteParams, ToggleSaveQuestionParams } from '@/lib/actions/shared.types';
import { saveQuestion } from '@/lib/actions/user.actions';
import { formatLargeNumber } from '@/lib/utils';
import { useToast } from '@chakra-ui/react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

interface VotesProps {
  type: string; 
  itemId: string;
  userId: string; 
  upvotes: number;
  hasUpvoted: boolean;
  downvotes: number;
  hasDownvoted: boolean;
  hasSaved?: boolean;
}

const Votes = ({
  type,
  itemId,
  userId,
  upvotes,
  hasUpvoted,
  downvotes,
  hasDownvoted,
  hasSaved,
} : VotesProps) => {
  const pathName = usePathname()  
  const [error, setError] = useState("");
  const toast = useToast();
  const router = useRouter();
  const handleSave = () => {
    if (!userId) {
      router.push('/sign-in');
      toast({
        title: 'To save question, you need to log in',
        status: 'info',
        isClosable: true,
      });
      return;
    }
    const params:ToggleSaveQuestionParams = {
      userId,
      questionId: itemId,
      hasSaved,
      path:pathName
    };
    saveQuestion(params);
    if (!hasSaved) {
      toast({
        title: 'Successfully saved question into your collection',
        status: 'success',
        isClosable: true,
      })
    }
  }

  const handleVote = async (voteType: string) => {
    if (!userId) {
      router.push('/sign-in');
      toast({
        title: 'To vote, you need to log in',
        status: 'info',
        isClosable: true,
      });
      return;
    }
    if (type === "question") {
      try {
        const params: QuestionVoteParams = {
          questionId: itemId,
          userId,
          hasupVoted: hasUpvoted,
          hasdownVoted: hasDownvoted,
          path: pathName
        };
        if (voteType === 'upvote'){
          await upvoteQuestion(params);
        } else if (voteType === 'downvote') {
          await downvoteQuestion(params);
        }
      } catch (error) {
        console.error('Error voting:', error);
        setError(`Error updating votes for a question`)
      }
    } else if (type === "answer") {
        try {
          const params: AnswerVoteParams = {
            answerId: itemId,
            userId, 
            hasupVoted: hasUpvoted,
            hasdownVoted: hasDownvoted,
            path: pathName
          };
          if (voteType === 'upvote'){
            await upvoteAnswer(params);
          } else if (voteType === 'downvote') {
            await downvoteAnswer(params);
          }
      } catch (err){
        console.error('Error voting:', error);
        setError(`Error updating votes for an answer`)
      }
    } 
  }
  useEffect(() => {
    viewQuestion({questionId: itemId, userId})
  }, [itemId, userId, pathName, router])
  if (error){
    return <p className='body-semibold text-red-500'>{error}</p>
  }
  return (
    <div className='flex gap-5'>
      <div className='flex-center gap-2.5'>
        <div className='flex-center gap-1.5'>
          <Image 
            src={hasUpvoted ? "/assets/icons/upvoted.svg" : "/assets/icons/upvote.svg"}
            width={18} 
            height={18} 
            alt="upvote" 
            className='cursor-pointer'
            onClick={() => handleVote("upvote")}
            />
          <div className='flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1'>
            <p className='subtle-medium text-dark400_light900'>
              {formatLargeNumber(upvotes)}
            </p>
          </div>
        </div>

        <div className='flex-center gap-1.5'>
          <Image 
            src={hasDownvoted ? "/assets/icons/downvoted.svg" : "/assets/icons/downvote.svg"}
            width={18} 
            height={18} 
            alt="downvote" 
            className='cursor-pointer'
            onClick={() => handleVote("downvote")}
            />
          <div className='flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1'>
            <p className='subtle-medium text-dark400_light900'>
              {formatLargeNumber(downvotes)}
            </p>
          </div>
        </div>
      </div>
      {type === "question" && 
        <Image 
          src={hasSaved ? "/assets/icons/star-filled.svg" : "/assets/icons/star-red.svg"}
          width={18} 
          height={18} 
          alt="saved" 
          className='cursor-pointer'
          onClick={handleSave}
        />}
    </div>
  );
}

export default Votes;
