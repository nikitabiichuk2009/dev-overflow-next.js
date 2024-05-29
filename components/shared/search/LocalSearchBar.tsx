'use client';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import React, { useRef } from 'react';

const LocalSearchBar = ({ searchFor, iconPosition, imgSrc, otherClasses }: { searchFor: string, iconPosition: string, imgSrc: string, otherClasses?: string }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const handleImageClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className={`background-light800_darkgradient relative flex min-h-[56px] grow items-center rounded-xl px-4 ${otherClasses}`}>
      {iconPosition === "left" &&
        <>
          <Image
            src={imgSrc}
            width={24}
            height={24}
            alt="search"
            className='cursor-pointer'
            onClick={handleImageClick}
          />
          <Input
            onChange={() => { }}
            type="text"
            placeholder={searchFor}
            ref={inputRef}
            className='paragraph-regular no-focus placeholder text-dark400_light700
           ml-2 border-none
           bg-transparent shadow-none outline-none'
          />
        </>}
      {iconPosition === "right" &&
        <>
          <Input
            onChange={() => { }}
            type="text"
            placeholder={searchFor}
            ref={inputRef}
            className='paragraph-regular no-focus placeholder 
            text-dark400_light700 ml-2 border-none
           bg-transparent shadow-none outline-none'
          />
          <Image
            src={imgSrc}
            width={24}
            height={24}
            alt="search"
            className='cursor-pointer'
            onClick={handleImageClick}
          />
        </>}
    </div>

  );
};

export default LocalSearchBar;
