import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Devflow | Home Page",
  description: "Home page of Devflow",
  icons: {
    icon: "/assets/images/site-logo.svg",
  },
};

const Loading = () => {
  return (
    <>
      <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>
        <Link href="/ask-question" className="flex justify-end max-sm:w-full">
          <Button className="primary-gradient min-h-[46px] px-4 py-3 font-semibold !text-light-900">Ask a Question</Button>
        </Link>
      </div>
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <Skeleton className="h-14 w-full" />
        <div className="hidden max-md:block">
          <Skeleton className="min-h-14 sm:min-w-[170px]" />
        </div>
      </div>
      <div className="mt-10 hidden flex-wrap gap-3 md:flex">
        {Array.from({ length: 4 }).map((_, idx) => (
          <Skeleton key={idx} className="h-9 w-28" />
        ))}
      </div>
      <div className="mt-10">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="mt-6 h-40 w-full" />
        <Skeleton className="mt-6 h-40 w-full" />
        <Skeleton className="mt-6 h-40 w-full" />
        <Skeleton className="mt-6 h-40 w-full" />
        <Skeleton className="mt-6 h-40 w-full" />
        <Skeleton className="mt-6 h-40 w-full" />
        <Skeleton className="mt-6 h-40 w-full" />
        <Skeleton className="mt-6 h-40 w-full" />
        <Skeleton className="mt-6 h-40 w-full" />
      </div>
      <div className="mt-10 flex w-full items-center justify-center gap-2">
        <Skeleton className="h-10 w-20 rounded-md" />
        <Skeleton className="size-10 rounded-md" />
        <Skeleton className="h-10 w-20 rounded-md" />
      </div>
    </>
  );
};

export default Loading;