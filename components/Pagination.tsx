"use client";
import React, { useState } from 'react';
import { Button } from './ui/button';
import { formUrlQuery } from '@/lib/utils';
import { useSearchParams, useRouter } from 'next/navigation';

const Pagination = ({ pageNumber, isNext }: { pageNumber: number, isNext: boolean }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isDisabled, setIsDisabled] = useState(false);

  const handleNavigation = (direction: string) => {
    if (isDisabled) return; // Prevent further clicks while disabled

    setIsDisabled(true);
    const nextpageNumber = direction === "prev" ? pageNumber - 1 : pageNumber + 1;
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "page",
      value: nextpageNumber.toString(),
    });
    router.push(newUrl);

    setTimeout(() => {
      setIsDisabled(false);
    }, 2000); // Disable buttons for 2 seconds
  };

  return (
    <div className='flex w-full items-center justify-center gap-2'>
      <Button
        disabled={pageNumber === 1 || isDisabled}
        onClick={() => handleNavigation("prev")}
        className='light-border-2 btn flex min-h-[36px] items-center justify-center gap-2 border'
      >
        <p className='body-medium text-dark200_light800'>Prev</p>
      </Button>
      <div className='flex items-center justify-center rounded-md bg-primary-500 p-3.5 py-2'>
        <p className='body-semibold text-light-900'>{pageNumber}</p>
      </div>
      <Button
        disabled={!isNext || isDisabled}
        onClick={() => handleNavigation("next")}
        className='light-border-2 btn flex min-h-[36px] items-center justify-center gap-2 border'
      >
        <p className='body-medium text-dark200_light800'>Next</p>
      </Button>
    </div>
  );
};

export default Pagination;
