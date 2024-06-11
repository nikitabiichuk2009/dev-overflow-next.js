"use client";
import { Button } from '@/components/ui/button'
import { formUrlQuery, removeKeysFromQuery } from '@/lib/utils';
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react'

const GlobalButton = ({ text }: { text: string }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("type");
  const handleClick = () => {
    if (query === text.toLocaleLowerCase()) {
      const newUrl = removeKeysFromQuery({
        params: searchParams.toString(),
        keys: ["type"],
      });
      router.push(newUrl, { scroll: false });
    } else {
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "type",
        value: text.toLocaleLowerCase(),
      });
      router.push(newUrl, { scroll: false });
    }
  }
  return (
    <div>
      <Button onClick={handleClick} className={`flex-center background-light700_dark300 rounded-3xl px-5 py-2.5 ${query === text.toLocaleLowerCase() && "bg-primary-500 dark:bg-primary-500"}`}>
        <p className={`font-bold transition-colors duration-150 ease-in-out ${query === text.toLocaleLowerCase() ? "text-light-900" : 'text-dark-500 hover:text-primary-500 dark:text-light-900 dark:hover:text-primary-500'}`}>{text}</p>
      </Button>
    </div>
  )
}

export default GlobalButton