import React from 'react'
import Filter from './filters/Filter';
import { AnswerFilters } from '@/constants/filters';
import { getAllAnswers } from '@/lib/actions/answer.actions';
import AnswerCard from '../cards/AnswerCard';

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

interface IAnswer {
  _id: string;
  author: IAuthor;
  question: string;
  content: string;
  upvotes: string[];
  downvotes: string[];
  createdAt: Date;
}


const AllAnswers = async ({ questionId, userId, totalAnswers }: {
  questionId: string;
  userId: string;
  totalAnswers: number;
  page?: number;
  flter?: string
}) => {
  const result = await getAllAnswers({ questionId });
  const answers: IAnswer[] = JSON.parse(JSON.stringify(result.answers));
  return (
    <div className='mt-11'>
      <div className='flex items-center justify-between'>
        <h3 className='primary-text-gradient'>{totalAnswers} {totalAnswers === 1 ? "Answer" : "Answers"}</h3>
        <Filter filters={AnswerFilters}
        />
      </div>
      <div>
        {answers.map((answer: IAnswer) => {
          return <AnswerCard key={answer._id} answerId={answer._id} upvotes={answer.upvotes} downvotes={answer.downvotes} questionId={answer.question} userId={userId} content={answer.content} createdAt={answer.createdAt} author={answer.author} />
        })}
      </div>
    </div>
  )
}

export default AllAnswers
