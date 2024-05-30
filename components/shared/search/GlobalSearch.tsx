'use client';
import { Input } from '@/components/ui/input';
import { useUser } from '@clerk/nextjs';
import Image from 'next/image';
import React, { useEffect, useRef } from 'react';

const GlobalSearch = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const user = useUser();
  const handleImageClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.ctrlKey && event.key === 'k') {
      event.preventDefault();
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className={`relative ${user.isSignedIn ? "w-[180px]" : "w-[220px]"}
     ${user.isSignedIn ? "sm:w-[250px]" : "sm:w-[300px]"}
     ${user.isSignedIn ? "md:w-[380px]" : "md:w-[430px]"}
     lg:w-[600px]`}>
      <div className='background-light800_darkgradient relative flex min-h-[56px] grow items-center rounded-xl px-4'>
        <Image
          src="/assets/icons/search.svg"
          width={24}
          height={24}
          alt="search"
          className='cursor-pointer'
          onClick={handleImageClick}
        />
        <Input
          type="text"
          placeholder='Search globally'
          ref={inputRef}
          className='paragraph-regular no-focus placeholder text-dark400_light700
          border-none 
           bg-transparent shadow-none outline-none'
        />
      </div>
    </div>
  );
};

export default GlobalSearch;
