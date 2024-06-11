"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Devflow | Tag Details Page",
  description: "Tag detail page of Devflow",
  icons: {
    icon: "/assets/images/site-logo.svg",
  },
};

const Loading = () => {
  return (
    <div>
      <h1 className="h1-bold text-dark100_light900">Some tag</h1>
      <div className="mt-11">
        <Skeleton className="h-14 w-full" />
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
    </div>
  );
};

export default Loading;
