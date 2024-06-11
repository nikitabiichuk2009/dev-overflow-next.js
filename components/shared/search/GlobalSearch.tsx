'use client';
import { Input } from '@/components/ui/input';
import { formUrlQuery, removeKeysFromQuery } from '@/lib/utils';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import GlobalResult from './GlobalResult';

const GlobalSearch = () => {
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.get("global");
  const [search, setSearch] = useState(query || "");
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLInputElement>(null);


  useEffect(() => {
    const handleOutsideClick = (event: any) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearch("")
      }
    }
    setIsOpen(false);
    setSearch("");
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick)
    }
  }, [pathName])

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (search) {
        const newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: "global",
          value: search
        })
        router.push(newUrl, { scroll: false })
      } else {
        if (query) {
          const newUrl = removeKeysFromQuery({
            params: searchParams.toString(),
            keys: ["global", "type"]
          })
          router.push(newUrl, { scroll: false })
        }
      }
      return () => clearTimeout(delayDebounceFn)
    }, 300)
  }, [search, pathName, searchParams, query, router])

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
    <div className={`relative hidden lg:flex lg:w-[600px]`} ref={searchContainerRef}>
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
          onChange={(e) => {
            setSearch(e.target.value);
            if (!isOpen) setIsOpen(true);
            if (e.target.value === '' && isOpen) setIsOpen(false);
          }}
          ref={inputRef}
          value={search}
          className='paragraph-regular no-focus placeholder text-dark400_light700
          border-none 
           bg-transparent shadow-none outline-none'
        />
      </div>
      {isOpen && <GlobalResult />}
    </div>
  );
};

export default GlobalSearch;
