import LocalSearchBar from "@/components/shared/search/LocalSearchBar";
import Filter from "@/components/shared/filters/Filter";
import { HomePageFilters } from "@/constants/filters";
import QuestionCard from "@/components/cards/QuestionCard";
import NoResults from "@/components/shared/NoResults";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getSavedQuestions } from "@/lib/actions/user.actions";

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

export default async function Home() {
  let savedQuestionsParsed = [];
  const { userId } = auth();
  if (!userId) {
    redirect("/sign-in")
  }
  try {
    const result = await getSavedQuestions({ clerkId: userId });
    savedQuestionsParsed = JSON.parse(JSON.stringify(result?.savedQuestions));
    // console.log(savedQuestionsParsed);
  } catch (err) {
    console.error('Failed to fetch questions', err);
    return (
      <div>
        <h1 className="h1-bold text-dark100_light900">Saved Questions</h1>
        <NoResults
          title="Error fetching your saved questions"
          description="There was an error fetching your saved questions. Please try again later."
          buttonTitle='Let me Try again'
          href='/'
        />
      </div>
    );
  }

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Saved Questions</h1>
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchBar
          searchFor="Search for questions"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          otherClasses="flex-1"
        />
        <Filter
          filters={HomePageFilters}
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
            title="There's no saved question to show"
            buttonTitle="Browse Questions"
            href="/"
            description="It looks like you haven't saved any questions yet. 
            🌟 Save interesting questions to revisit them later, or ask your own to start a new conversation. 
            Your curiosity could spark new insights and learning for everyone. Get involved and make a difference! 💡" />}
      </div>
    </>
  );
}
