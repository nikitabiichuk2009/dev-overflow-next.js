import LocalSearchBar from "@/components/shared/search/LocalSearchBar";
import Filter from "@/components/shared/filters/Filter";
import QuestionCard from "@/components/cards/QuestionCard";
import NoResults from "@/components/shared/NoResults";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getSavedQuestions } from "@/lib/actions/user.actions";
import { SearchParamsProps } from "@/types";
import { QuestionFilters } from "@/constants/filters";
import Pagination from "@/components/Pagination";
import { Metadata } from "next";


export const metadata: Metadata = {
  title: "Devflow | Collection Page",
  description: "Collection page of Devflow",
  icons: {
    icon: "/assets/images/site-logo.svg",
  },
};

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

export default async function Collection({ searchParams }: SearchParamsProps) {
  const searchQuery = searchParams ? searchParams.q : "";
  const filter = searchParams ? searchParams.filter : "";
  const page = searchParams?.page ? +searchParams.page : 1;

  let savedQuestionsParsed = [];
  let isNext;
  const { userId } = auth();
  if (!userId) {
    redirect("/sign-in")
  }
  try {
    const result = await getSavedQuestions({ clerkId: userId, searchQuery, filter, page });
    savedQuestionsParsed = JSON.parse(JSON.stringify(result?.savedQuestions));
    isNext = JSON.parse(JSON.stringify(result?.isNext));
    // console.log(savedQuestionsParsed);
  } catch (err) {
    console.error('Failed to fetch questions', err);
    return (
      <div>
        <h1 className="h1-bold text-dark100_light900">Saved Questions</h1>
        <NoResults
          title="Error fetching your saved questions"
          description="There was an error fetching your saved questions. Try to reload the page or press the button to go back. If that didn't help, Please try again later."
          buttonTitle='Go back'
          href='../'
        />
      </div>
    );
  }

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Saved Questions</h1>
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchBar
          searchFor="Search for saved questions"
          iconPosition="left"
          route="/collection"
          imgSrc="/assets/icons/search.svg"
          otherClasses="flex-1"
        />
        <Filter
          filters={QuestionFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
        />
      </div>
      <div className="mt-10 flex w-full flex-col gap-6">
        {savedQuestionsParsed.length > 0 ?
          savedQuestionsParsed.map((question: Question) => {
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
            title={`There are no ${filter || ""} saved questions to show`}
            buttonTitle="Browse Questions"
            href="/"
            description="It looks like you haven't saved any questions yet. 
            😔 Save interesting questions to revisit them later, or ask your own to start a new conversation. 
            Your curiosity could spark new insights and learning for everyone. Get involved and make a difference! 💡" />}
        <div className='mt-10'>
          <Pagination
            pageNumber={page}
            isNext={isNext}
          />
        </div>
      </div>
    </>
  );
}
