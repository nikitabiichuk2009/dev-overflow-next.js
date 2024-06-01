import AnswerForm from '@/components/forms/AnswerForm';
import AllAnswers from '@/components/shared/AllAnswers';
import Metric from '@/components/shared/Metric';
import NoResults from '@/components/shared/NoResults';
import ParseHtml from '@/components/shared/ParseHtml';
import Tag from '@/components/shared/Tag';
import Votes from '@/components/shared/Votes';
import { getQuestionById } from '@/lib/actions/question.actions';
import { getUserById } from '@/lib/actions/user.actions';
import { formatLargeNumber, getTimestamp } from '@/lib/utils';
import { auth } from '@clerk/nextjs/server';
import console from 'console';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface TagInterface {
  _id: string;
  name: string;
  questions: string[];
}

const Page = async ({ params }: any) => {
  const { userId } = auth();
  let mongoUser = null;

  if (userId) {
    const mongoUserInitial = await getUserById({ userId });
    mongoUser = JSON.parse(JSON.stringify(mongoUserInitial));
  } else {
    console.log("No user now");
  }

  let parsedQuestion;
  try {
    const result = await getQuestionById({ questionId: params.id });
    parsedQuestion = JSON.parse(JSON.stringify(result));
  } catch (error) {
    console.error("Error fetching question:", error);
    return (
      <div>
        <div className='mt-12 flex flex-wrap gap-4'>
          <NoResults
            title="Error fetching question"
            description="There was an error fetching the question. Please try again later."
            buttonTitle='Go back'
            href='../'
          />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className='flex-start w-full flex-col'>
        <div className="flex w-full flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
          <Link className='flex w-fit items-center justify-start gap-2' href={`/profile/${parsedQuestion.author.clerkId}`}>
            <div className='relative size-10'>
              <Image src={parsedQuestion.author.picture} alt="user's avatar" layout="fill" className='rounded-full object-cover' />
            </div>
            <h3 className='h3-semibold text-dark300_light700'>{parsedQuestion.author.name}</h3>
          </Link>
          <div className='flex justify-end'>
          <Votes 
            type="question"
            itemId={parsedQuestion._id} 
            userId={mongoUser ? mongoUser._id : "null"}
            upvotes={parsedQuestion.upvotes.length}
            hasUpvoted={mongoUser ? parsedQuestion.upvotes.includes(mongoUser._id): false}
            downvotes={parsedQuestion.downvotes.length}
            hasDownvoted={mongoUser ? parsedQuestion.downvotes.includes(mongoUser._id): false}
            hasSaved={mongoUser ? mongoUser.savedPosts.includes(parsedQuestion._id): false}
          />
          </div>
        </div>
        <h2 className='h2-semibold text-dark200_light900 mt-3.5 w-full text-left'>{parsedQuestion.title}</h2>
      </div>
      <div className='mb-8 mt-5 flex flex-wrap gap-4'>
        <Metric imgUrl="/assets/icons/clock.svg" alt="clock icon" value={`Asked ${getTimestamp(parsedQuestion.createdAt) || 0}`} title="" textStyles="small-medium text-dark400_light800" />
        <Metric imgUrl="/assets/icons/message.svg" alt="message" value={formatLargeNumber(parsedQuestion.answers.length) || 0} title=" Answers" textStyles="small-medium text-dark400_light800" />
        <Metric imgUrl="/assets/icons/eye.svg" alt="views" value={formatLargeNumber(parsedQuestion.views) || 0} title=" Views" textStyles="small-medium text-dark400_light800" />
      </div>
      <ParseHtml data={parsedQuestion.content} />
      <div className='mt-8 flex flex-wrap gap-2'>
        {parsedQuestion.tags.map((tag: TagInterface) => (
          <Tag key={tag._id} id={tag._id} title={tag.name} classNameSizeCustom="subtle-medium uppercase px-4 py-2" classNameBgCustom='background-light800_dark300Tag' />
        ))}
      </div>
      <AllAnswers
        userId={mongoUser ? mongoUser._id : ""}
        questionId={parsedQuestion._id}
        totalAnswers={parsedQuestion.answers.length}
      />
      <AnswerForm authorId={mongoUser ? mongoUser._id : ""} question={parsedQuestion._id} />
    </>
  );
}

export default Page;
