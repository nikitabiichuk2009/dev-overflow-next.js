"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Devflow | Edit a Profile Page",
  description: "Edit a profile page of Devflow",
  icons: {
    icon: "/assets/images/site-logo.svg",
  },
};

const Loading = () => {
  return (
    <div>
      <h1 className='h1-bold text-dark100_light900'>Edit your Profile</h1>
      <div className='mt-9 flex flex-col gap-10'>
        <div className="flex w-full flex-col">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="mt-2 h-5 w-3/4" />
          <Skeleton className="mt-3.5 h-14 w-full" />
          <Skeleton className="mt-2.5 h-5 w-1/2" />
        </div>

        <div className="flex w-full flex-col">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="mt-2 h-5 w-3/4" />
          <Skeleton className="mt-3.5 h-14 w-full" />
          <Skeleton className="mt-2.5 h-5 w-1/2" />
        </div>

        <div className="flex w-full flex-col">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="mt-2 h-5 w-3/4" />
          <Skeleton className="mt-3.5 h-28 w-full" />
          <Skeleton className="mt-2.5 h-5 w-1/2" />
        </div>

        <div className="flex justify-end">
          <Skeleton className='h-12 w-full sm:w-40' />
        </div>
      </div>
    </div>
  );
};

export default Loading;
