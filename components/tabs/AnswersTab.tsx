import React from 'react'
import AnswerCardProfile from '../cards/AnswerCardProfile'
import { getUserAnswers } from '@/lib/actions/user.actions';
import NoResults from '../shared/NoResults';
import { SearchParamsProps } from '@/types';
import Pagination from '../Pagination';

interface Props extends SearchParamsProps {
  userId: string
}

const AnswersTab = async ({ searchParams, userId }: Props) => {
  const page = searchParams.page ? +searchParams.page : 1;

  let answers;
  let isNext;
  try {
    const answersInitial = await getUserAnswers({ userId, page });

    answers = JSON.parse(JSON.stringify(answersInitial.answers));
    isNext = JSON.parse(JSON.stringify(answersInitial.isNext));

  } catch (error) {
    console.log(error);
    return (
      <div>
        <h1 className="h1-bold text-dark100_light900">Error</h1>
        <NoResults
          title="Error fetching user' answers"
          description="There was an error fetching the user's answers. Try to reload the page or press the button to go back. If that didn't help, Please try again later."
          buttonTitle="Go back"
          href="../"
        />
      </div>
    );
  }
  return (
    <div>
      {answers.length === 0 ?
        <p className='paragraph-semibold text-dark200_light900'>The user has not answered any questions yet.</p>

        : <div className='mt-7 flex w-full flex-col gap-6'>
          {answers.map((answer: any) => {
            return <AnswerCardProfile
              key={answer._id}
              answerId={answer._id}
              title={answer.question.title}
              questionId={answer.question._id}
              author={answer.author}
              tags={answer.question.tags}
              upvotes={answer.upvotes}
              downvotes={answer.downvotes}
              createdAt={answer.createdAt}
            />
          })}
        </div>
      }
      <div className="mt-10">
        <Pagination
          isNext={isNext}
          pageNumber={page}
        />
      </div>
    </div>

  )
}

export default AnswersTab