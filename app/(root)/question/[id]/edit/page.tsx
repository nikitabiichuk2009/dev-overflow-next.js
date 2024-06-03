import QuestionForm from '@/components/forms/QuestionForm';
import NoResults from '@/components/shared/NoResults';
import { getQuestionById } from '@/lib/actions/question.actions'
import { auth } from '@clerk/nextjs/server';
import React from 'react'

const Page = async ({ params }: any) => {
  let initialValues;
  let question;
  const { userId } = auth();
  if (!userId) {
    return (
      <div>
        <h1 className="h1-bold text-dark100_light900">403 code. Access is forbidden.</h1>
        <NoResults
          title="You are not logged in"
          description="You must be logged in to edit this question. Please log in and try again. If you believe this is an error, contact support (niktestpython@gmail.com) for further assistance."
          buttonTitle="Sign In"
          href="/sign-in"
        />
      </div>
    );
  }
  try {
    const result = await getQuestionById({ questionId: params.id });
    question = JSON.parse(JSON.stringify(result));
    initialValues = {
      id: question._id,
      title: question.title,
      explanation: question.content,
      tags: question.tags
    };
    if (question.author.clerkId !== userId) {
      return (
        <div>
          <h1 className="h1-bold text-dark100_light900">403 code. Access is forbidden.</h1>
          <NoResults
            title="You are not the question creator"
            description="You do not have permission to edit this question. Please ensure you are logged in with the correct account. If you believe this is an error, contact support (niktestpython@gmail.com) for further assistance."
            buttonTitle="Go back"
            href="/"
          />
        </div>
      );
    }
  } catch (err) {
    console.log(err);
    return (
      <div>
        <h1 className="h1-bold text-dark100_light900">Error</h1>
        <NoResults
          title="Error fetching question data"
          description="There was an error fetching the question data. Try to reload the page or press the button to go back. If that didn't help, Please try again later."
          buttonTitle="Go back"
          href="/"
        />
      </div>
    );
  }

  return (
    <div>
      <h1 className='h1-bold text-dark100_light900'>Edit a question</h1>
      <div className='mt-9'>
        <QuestionForm initialValues={initialValues} type='edit' />
      </div>
    </div>
  )
}

export default Page