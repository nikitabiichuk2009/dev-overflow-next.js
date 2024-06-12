import QuestionForm from '@/components/forms/QuestionForm'
import NoResults from '@/components/shared/NoResults';
import { getUserById } from '@/lib/actions/user.actions';
import { auth } from '@clerk/nextjs/server'
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import React from 'react'


export const metadata: Metadata = {
  title: "Devflow | Ask a Question Page",
  description: "Ask a question page of Devflow",
  icons: {
    icon: "/assets/images/site-logo.svg",
  },
};

const AskQuestion = async () => {
  const { userId } = auth();
  let mongoUser;
  if (!userId) {
    redirect("/sign-in")
  }
  try {
    mongoUser = await getUserById({ userId })
  } catch (err) {
    console.log(err)
    return (
      <div>
        <h1 className="h1-bold text-dark100_light900">Error</h1>
        <NoResults
          title="Error loading user"
          description="Failed to load user information. Please try again later."
          buttonTitle="Go back"
          href="/"
        />
      </div>
    );
  }
  // console.log(mongoUser)
  return (
    <div>
      <h1 className='h1-bold text-dark100_light900'>Ask a question</h1>
      <div className='mt-9'>
        <QuestionForm mongoUserId={JSON.stringify(mongoUser._id)} type="create" />
      </div>
    </div>
  )
}

export default AskQuestion
