import React from 'react'
import Filter from './filters/Filter';
import { AnswerFilters } from '@/constants/filters';
import { getAllAnswers } from '@/lib/actions/answer.actions';
import AnswerCard from '../cards/AnswerCard';
import Pagination from '../Pagination';
import { SearchParamsProps } from '@/types';

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

interface Props extends SearchParamsProps {
  questionId: string;
  userId: string;
  totalAnswers: number;
  page?: number;
  filter?: string;
}


const AllAnswers = async ({ searchParams, filter, questionId, userId, totalAnswers }: Props) => {
  const page = searchParams?.page ? +searchParams.page : 1;
  const result = await getAllAnswers({ questionId, sortBy: filter, page });
  const answers: IAnswer[] = JSON.parse(JSON.stringify(result.answers));
  const isNext = JSON.parse(JSON.stringify(result.isNext));
  return (
    <div className='mt-11'>
      <div className='flex items-center justify-between'>
        <h3 className='primary-text-gradient'>{totalAnswers} {totalAnswers === 1 ? "Answer" : "Answers"}</h3>
        {totalAnswers > 0 && <Filter filters={AnswerFilters}
        />}

      </div>
      <div>
        {answers.map((answer: IAnswer) => {
          return <AnswerCard key={answer._id} answerId={answer._id} upvotes={answer.upvotes} downvotes={answer.downvotes} questionId={answer.question} userId={userId} content={answer.content} createdAt={answer.createdAt} author={answer.author} />
        })}
      </div>
      <div className='mt-10'>
        <Pagination
          pageNumber={page}
          isNext={isNext}
        />
      </div>
    </div>
  )
}

export default AllAnswers
