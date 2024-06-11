import { Skeleton } from "@/components/ui/skeleton";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Devflow | Collection Page",
  description: "Collection page of Devflow",
  icons: {
    icon: "/assets/images/site-logo.svg",
  },
};

const Loading = () => {
  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Saved Questions</h1>
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <Skeleton className="h-14 w-full" />
        <div className="flex">
          <Skeleton className="min-h-14 w-full sm:min-w-[170px]" />
        </div>
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