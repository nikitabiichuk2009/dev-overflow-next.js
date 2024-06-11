"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Devflow | Profile Page",
  description: "Profile page of Devflow",
  icons: {
    icon: "/assets/images/site-logo.svg",
  },
};

const Loading = () => {
  return (
    <div>
      <div className="flex flex-col-reverse items-start justify-between sm:flex-row">
        <div className="flex flex-col items-start gap-4 lg:flex-row">
          <div>
            <Skeleton className="size-36 rounded-full" />
          </div>
          <div className="mt-3">
            <Skeleton className="h-8 w-40" />
            <Skeleton className="mt-1 h-5 w-24" />
            <div className="mt-5 flex flex-wrap items-center justify-start gap-5">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-5 w-24" />
            </div>
            <Skeleton className="mt-3 h-5 w-3/4" />
          </div>
        </div>
        <div className="flex justify-end max-sm:mb-5 max-sm:w-full sm:mt-3">
          <Skeleton className="min-h-[46px] min-w-[175px]" />
        </div>
      </div>
      <div className="mt-10">
        <h3 className="h3-semibold text-dark200_light900 mb-4">Stats</h3>
        <Skeleton className="mb-7 mt-3 h-5 w-full" />
        <div className="flex flex-wrap gap-4">
          {Array.from({ length: 6 }).map((_, idx) => (
            <Skeleton key={idx} className="h-[90px] w-full rounded-lg md:w-[257px]" />
          ))}
        </div>
      </div>
      <div className="mt-10 flex gap-10">
        <div className="flex-1">
          <div className="flex flex-row gap-5 p-1">
            <div className="tab">
              <Skeleton className="h-8 w-20" />
            </div>
            <div className="tab">
              <Skeleton className="h-8 w-20" />
            </div>
            <div className="tab">
              <Skeleton className="h-8 w-20" />
            </div>
          </div>
          <div className="mt-7">
            {Array.from({ length: 2 }).map((_, idx) => (
              <Skeleton key={idx} className="mt-4 h-[150px] w-full rounded-lg" />
            ))}
          </div>
          <div className="mt-10 flex w-full items-center justify-center gap-2">
            <Skeleton className="h-10 w-20 rounded-md" />
            <Skeleton className="size-10 rounded-md" />
            <Skeleton className="h-10 w-20 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;
