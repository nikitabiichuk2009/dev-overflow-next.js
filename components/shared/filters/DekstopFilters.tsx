'use client';
import { Button } from '@/components/ui/button';
import { HomePageFilters } from '@/constants/filters';
import { formUrlQuery, removeKeysFromQuery } from '@/lib/utils';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react';

const DekstopFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("filter");
  const [search, setSearch] = useState(query || "");
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const handleTypeClick = (item: string) => {
    if (search === item) {
      const newUrl = removeKeysFromQuery({
        params: searchParams.toString(),
        keys: ["filter"],
      });
      router.push(newUrl, { scroll: false });
    } else {
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "filter",
        value: item,
      });
      router.push(newUrl, { scroll: false });
    }
  };

  const handleButtonClick = (item: string) => {
    if (isButtonDisabled) return;

    setIsButtonDisabled(true);
    setTimeout(() => setIsButtonDisabled(false), 1500);

    setSearch(prevSearch => prevSearch === item ? "" : item);
    handleTypeClick(item);
  };

  return (
    <div className='mt-10 hidden flex-wrap gap-3 md:flex'>
      {HomePageFilters.map((item) => (
        <Button
          key={item.value}
          onClick={() => handleButtonClick(item.value)}
          className={`body-medium rounded-lg px-6 py-3 capitalize shadow-none 
          ${query !== null && search === item.value
              ? "bg-primary-100 text-primary-500 dark:bg-dark-400"
              : "bg-light-800 text-light-500 transition-colors duration-300 ease-in-out hover:bg-light-700 dark:bg-dark-300 dark:hover:bg-dark-200"}`}
          disabled={isButtonDisabled}
        >
          {item.name}
        </Button>
      ))}
    </div>
  );
};

export default DekstopFilters;
