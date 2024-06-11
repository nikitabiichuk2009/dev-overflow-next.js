"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Devflow | Question Details Page",
  description: "Question detail page of Devflow",
  icons: {
    icon: "/assets/images/site-logo.svg",
  },
};

const Loading = () => {
  return (
    <div>
      <div className="flex w-full flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
        <div className="flex w-fit items-center justify-start gap-2">
          <Skeleton className="size-10 rounded-full" />
          <Skeleton className="h-6 w-40" />
        </div>
        <div className="flex justify-end gap-2">
          <Skeleton className="h-6 w-10" />
          <Skeleton className="h-6 w-10" />
          <Skeleton className="h-6 w-10" />
        </div>
      </div>
      <Skeleton className="mt-3.5 h-8 w-3/4" />
      <div className="mb-8 mt-5 flex flex-wrap gap-4">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-6 w-20" />
      </div>
      <Skeleton className="h-40 w-full" />
      <div className="mt-8 flex flex-wrap gap-2">
        {Array.from({ length: 3 }).map((_, idx) => (
          <Skeleton key={idx} className="h-8 w-20 rounded-md" />
        ))}
      </div>
      <div className="mt-11">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="mt-5">
          {Array.from({ length: 5 }).map((_, idx) => (
            <Skeleton key={idx} className="mt-4 h-40 w-full rounded-md" />
          ))}
        </div>
        <div className="mt-10 flex w-full items-center justify-center gap-2">
          <Skeleton className="h-10 w-20 rounded-md" />
          <Skeleton className="size-10 rounded-md" />
          <Skeleton className="h-10 w-20 rounded-md" />
        </div>
      </div>
      <div className="mt-6 flex flex-col justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-10 w-40" />
      </div>
      <Skeleton className="mt-5 h-80 w-full" />
      <Skeleton className="mt-5 h-10 w-full" />
      <div className="flex justify-end">
        <Skeleton className="mt-5 h-12 w-full sm:w-40" />
      </div>
    </div>
  );
};

export default Loading;
