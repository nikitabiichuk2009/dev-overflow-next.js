import { Button } from "@/components/ui/button";
import Link from "next/link";
import LocalSearchBar from "@/components/shared/search/LocalSearchBar";
import Filter from "@/components/shared/filters/Filter";
import { HomePageFilters } from "@/constants/filters";
import DekstopFilters from "@/components/shared/filters/DekstopFilters";
import QuestionCard from "@/components/cards/QuestionCard";
import NoResults from "@/components/shared/NoResults";
import { getQuestions, getRecommendedQuestions } from "@/lib/actions/question.actions";
import { SearchParamsProps } from "@/types";
import Pagination from "@/components/Pagination";
import { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";


export const metadata: Metadata = {
  title: "Devflow | Home Page",
  description: "Home page of Devflow",
  icons: {
    icon: "/assets/images/site-logo.svg",
  },
};

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



export default async function Home({ searchParams }: SearchParamsProps) {
  const { userId } = auth();
  let questionsParsed;
  let isNext;
  const searchQuery = searchParams ? searchParams.q : "";
  const filter = searchParams ? searchParams.filter : "";
  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  try {
    if (filter === "recommended") {
      if (userId) {
        const result = await getRecommendedQuestions({ userId, searchQuery, page });
        questionsParsed = JSON.parse(JSON.stringify(result?.questions));
        isNext = JSON.parse(JSON.stringify(result?.isNext));
      } else {
        questionsParsed = [];
        isNext = false;
      }
    }
    else {
      const result = await getQuestions({ searchQuery, filter, page });
      questionsParsed = JSON.parse(JSON.stringify(result?.questions));
      isNext = JSON.parse(JSON.stringify(result?.isNext));
      // console.log(questionsParsed);
    }
  } catch (err) {
    console.error('Failed to fetch questions', err);
    return (
      <div>
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>
        <NoResults
          title="Error fetching questions"
          description="There was an error fetching the questions. Try to reload the page or press the button to go back. If that didn't help, Please try again later."
          buttonTitle='Go back'
          href='../'
        />
      </div>
    );
  }
  return (
    <>
      <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="h1-bold text-dark100_light900">All Questions</h1>
          <p className='mb-7 mt-3.5 font-spaceGrotesk text-[16px] font-normal leading-[19.6px] text-light-500'>
            <span className="font-bold text-red-500">!IMPORTANT!:</span> If you have logged in or signed up and your profile button didn't appear in the top right corner of the navigation bar, please reload the page. Thank you for your patience!
          </p>
        </div>
        <Link href="/ask-question" className="flex justify-end max-sm:w-full">
          <Button className="primary-gradient min-h-[46px] px-4 py-3 font-semibold !text-light-900">Ask a Question</Button>
        </Link>
      </div>
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchBar
          searchFor="Search for questions"
          iconPosition="left"
          route="/"
          imgSrc="/assets/icons/search.svg"
          otherClasses="flex-1"
        />
        <Filter
          filters={HomePageFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
          containerClasses="hidden max-md:flex"
        />
      </div>
      <DekstopFilters />
      <div className="mt-10 flex w-full flex-col gap-6">
        {questionsParsed.length > 0 ?
          questionsParsed.map((question: Question) => {
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
            title={`There are no ${filter || ""} questions to show`}
            buttonTitle="Ask a Question"
            href="/ask-question"
            description="Be the first to break the silence! 
            🚀 Ask a Question and kickstart the discussion. Our query could be the next big thing others learn from. Get involved! 💡" />}
      </div>
      <div className="mt-10">
        <Pagination
          pageNumber={searchParams?.page ? +searchParams.page : 1}
          isNext={isNext}
        />
      </div>
    </>
  );
}
