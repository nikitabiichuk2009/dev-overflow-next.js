import Pagination from '@/components/Pagination';
import QuestionCard from '@/components/cards/QuestionCard';
import NoResults from '@/components/shared/NoResults';
import LocalSearchBar from '@/components/shared/search/LocalSearchBar';
import { fetchQuestionsByTagId } from '@/lib/actions/tag.actions';
import React from 'react'

interface Question {
  _id: string;
  title: string;
  tags: { _id: string; name: string }[];
  author: { _id: string; clerkId: string; name: string; picture: string };
  upvotes: any[];
  answers: any[];
  views: number;
  createdAt: Date;
}

const Page = async ({ searchParams, params }: any) => {
  let tagTitle = '';
  let questions = [];
  let isNext;
  const searchQuery = searchParams ? searchParams.q : "";
  const page = searchParams?.page ? +searchParams.page : 1;

  try {
    const tagId = params.id;
    const result = await fetchQuestionsByTagId({ tagId, searchQuery, page });
    const parsedResult = JSON.parse(JSON.stringify(result));
    tagTitle = parsedResult.tagTitle;
    questions = parsedResult.questions;
    isNext = parsedResult.isNext;
  } catch (err) {
    console.error('Failed to fetch questions by tag ID', err);
    return (
      <div>
        <h1 className="h1-bold text-dark100_light900">Tag Details</h1>
        <NoResults
          title="Error fetching tag"
          description="There was an error fetching the tag.Try to reload the page or press the button to go back. If that didn't help, Please try again later."
          buttonTitle="Go back"
          href="/tags"
        />
      </div>
    );
  }
  return (
    <>
      <h1 className="h1-bold text-dark100_light900">{tagTitle}</h1>
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchBar
          searchFor="Search questions by tag"
          iconPosition="left"
          route={`/tag${params.id}`}
          imgSrc="/assets/icons/search.svg"
          otherClasses="flex-1"
        />
      </div>
      <div className="mt-10 flex w-full flex-col gap-6">
        {questions.length > 0 ?
          questions.map((question: Question) => {
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
          }) : <NoResults
            title={`No questions found for the tag "${tagTitle}"`}
            buttonTitle="Browse All Tags"
            href="/tags"
            description={`It looks like there are no questions associated with the tag "${tagTitle}" yet. 
          😔 Explore other tags or ask your own question to get the discussion started. 
          Your curiosity could spark new insights and learning for everyone. Get involved and make a difference! 💡`}
          />}
        <div className='mt-10'>
          <Pagination
            pageNumber={page}
            isNext={isNext}
          />
        </div>
      </div>
    </>
  )
}

export default Page;
