import { Button } from "@/components/ui/button";
import Link from "next/link";
import LocalSearchBar from "@/components/shared/search/LocalSearchBar";
import Filter from "@/components/shared/filters/Filter";
import { HomePageFilters } from "@/constants/filters";
import DekstopFilters from "@/components/shared/filters/DekstopFilters";
import QuestionCard from "@/components/cards/QuestionCard";
import NoResults from "@/components/shared/NoResults";

const questions = [
  {
    _id: 1,
    title: "Best practices for data fetching in a Next.js application with Server-Side Rendering (SSR)?",
    tags: [
      { _id: '1', name: "NEXTJS" },
      { _id: '2', name: "REACT" }
    ],
    author: {
      _id: "1",
      name: "Sujata | JS Mastery",
      picture: "/assets/icons/avatar.svg"
    },
    upvotes: 710505005,
    answers: new Array(101).fill({}),
    views: 7400,
    createdAt: new Date("2024-01-15T08:00:00Z")
  },
  {
    _id: 2,
    title: "Redux Toolkit Not Updating State as Expected",
    tags: [
      { _id: '3', name: "REACT.JS" },
      { _id: '4', name: "REDUX" }
    ],
    author: {
      _id: "2",
      name: "John Doe",
      picture: "/assets/icons/avatar.svg"
    },
    upvotes: 17,
    answers: new Array(8).fill({}),
    views: 1400,
    createdAt: new Date("2024-05-20T10:00:00Z")
  },
  {
    _id: 3,
    title: "Async/Await Function Not Handling Errors Properly",
    tags: [
      { _id: '5', name: "JAVASCRIPT" }
    ],
    author: {
      _id: "3",
      name: "Jane Smith",
      picture: "/assets/icons/avatar.svg"
    },
    upvotes: 9,
    answers: new Array(7).fill({}),
    views: 1200,
    createdAt: new Date("2024-03-10T14:00:00Z")
  },
  {
    _id: 4,
    title: "How do ES6 module exports and imports work in JavaScript, and what are the key differences?",
    tags: [
      { _id: '6', name: "JAVASCRIPT" },
      { _id: '7', name: "ES6" }
    ],
    author: {
      _id: "4",
      name: "Alice Johnson",
      picture: "/assets/icons/avatar.svg"
    },
    upvotes: 4,
    answers: new Array(3).fill({}),
    views: 296,
    createdAt: new Date("2023-04-05T16:00:00Z")
  },
  {
    _id: 5,
    title: "How to Perfectly Center a Div with Tailwind CSS?",
    tags: [
      { _id: '8', name: "TAILWINDCSS" },
      { _id: '9', name: "REACT.JS" },
      { _id: '10', name: "CSS" }
    ],
    author: {
      _id: "5",
      name: "Bob Brown",
      picture: "/assets/icons/avatar.svg"
    },
    upvotes: 4,
    answers: new Array(10).fill({}),
    views: 384,
    createdAt: new Date("2024-05-25T09:00:00Z")
  }
];

// const questions = [];

export default function Home() {
  return (
    <>
      <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>
        <Link href="/ask-question" className="flex justify-end max-sm:w-full">
          <Button className="primary-gradient min-h-[46px] px-4 py-3 font-semibold !text-light-900">Ask a Question</Button>
        </Link>
      </div>
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
          containerClasses="hidden max-md:flex"
        />
      </div>
      <DekstopFilters />
      <div className="mt-10 flex w-full flex-col gap-6">
        {questions.length > 0 ?
          questions.map((question) => {
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
            title="There's no question to show"
            buttonTitle="Ask a Question"
            href="/ask-question"
            description="Be the first to break the silence! 
            🚀 Ask a Question and kickstart the discussion. Our query could be the next big thing others learn from. Get involved! 💡" />}
      </div>
    </>
  );
}
