import QuestionForm from '@/components/forms/QuestionForm'
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
  if (!userId) {
    redirect("/sign-in")
  }
  const mongoUser = await getUserById({ userId })
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
