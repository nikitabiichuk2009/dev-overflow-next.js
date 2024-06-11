"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Devflow | Community Page",
  description: "Community page of Devflow",
  icons: {
    icon: "/assets/images/site-logo.svg",
  },
};

const Loading = () => {
  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Our Community</h1>
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <Skeleton className="h-14 w-full" />
        <Skeleton className="min-h-14 sm:min-w-[170px]" />
      </div>
      <div className="mt-12 flex flex-wrap gap-4">
        {Array.from({ length: 20 }).map((_, idx) => (
          <Skeleton key={idx} className="h-[360px] w-full rounded-2xl md:w-[260px]" />
        ))}
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
