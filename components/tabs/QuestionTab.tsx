import React from 'react'
import QuestionCard from '../cards/QuestionCard';
import { getUserQuestions } from '@/lib/actions/user.actions';
import NoResults from '../shared/NoResults';
import { SearchParamsProps } from '@/types';


interface Question {
  _id: string;
  title: string;
  tags: { _id: string; name: string }[];
  author: { _id: string; name: string; picture: string, clerkId: string };
  upvotes: any[];
  answers: any[];
  views: number;
  createdAt: Date;
}

interface Props extends SearchParamsProps {
  userId: string
}

const QuestionTab = async ({ searchProps, userId }: Props) => {
  let questions;
  try {
    const questionsInitial = await getUserQuestions({ userId });

    questions = JSON.parse(JSON.stringify(questionsInitial));

  } catch (error) {
    console.log(error);
    return (
      <div>
        <h1 className="h1-bold text-dark100_light900">Error</h1>
        <NoResults
          title="Error fetching user' questions"
          description="There was an error fetching the user's questions.Try to reload the page or press the button to go back. If that didn't help, Please try again later."
          buttonTitle="Go back"
          href="../"
        />
      </div>
    );
  }
  return (
    <div>{questions.length === 0 ?
      <p className='paragraph-semibold text-dark200_light900'>The user has not posted any questions yet.</p>

      : questions.map((question: Question) => {
        return <QuestionCard
          key={question._id}
          id={question._id}
          title={question.title}
          tags={question.tags}
          author={question.author}
          upvotes={question.upvotes}
          answers={question.answers}
          views={question.views}
          createdAt={question.createdAt}
        />
      })
    }
    </div>
  )
}

export default QuestionTab