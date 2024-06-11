"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Devflow | Ask a Question Page",
  description: "Ask a question page of Devflow",
  icons: {
    icon: "/assets/images/site-logo.svg",
  },
};

const Loading = () => {
  return (
    <div>
      <h1 className="h1-bold text-dark100_light900">Ask a question</h1>
      <div className="mt-9">
        <div className="flex flex-col gap-10">
          <div className="flex flex-col">
            <Skeleton className="mb-3 h-6 w-1/4" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="mt-2 h-5 w-3/4" />
          </div>
          <div className="flex flex-col gap-3">
            <Skeleton className="mb-3 h-6 w-1/2" />
            <Skeleton className="h-80 w-full" />
            <Skeleton className="mt-2 h-5 w-3/4" />
          </div>
          <div className="flex flex-col">
            <Skeleton className="mb-3 h-6 w-1/6" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="mt-2 h-5 w-3/4" />
          </div>
          <div className="flex justify-end">
            <Skeleton className="h-12 w-full sm:w-40" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;
