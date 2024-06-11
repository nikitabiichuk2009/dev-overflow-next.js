'use client';
import React, { useEffect, useState } from 'react'
import { ReloadIcon } from "@radix-ui/react-icons"
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import GlobalFilters from './GlobalFilters';
import { globalSearch } from '@/lib/actions/general.action';

const GlobalResult = () => {
  const searchParams = useSearchParams();
  const global = searchParams.get("global");
  const type = searchParams.get("type");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState([]);
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchResult = async () => {
      setResult([]);
      setLoading(true);
      try {
        const res = await globalSearch({ query: global, type });
        setResult(JSON.parse(res));
      } catch (error) {
        console.log(error);
        setError(true);
      }
      finally {
        setLoading(false)
      }
    }
    if (global) {
      fetchResult();
    }
  }, [global, type])

  const renderLink = (type: string, id: string) => {
    let basePath = '/';
    if (type === "answer" || type === "question") {
      basePath = `/question/${id}`;
    } else if (type === "tag") {
      basePath = `/tags/${id}`;
    } else if (type === "user") {
      basePath = `/profile/${id}`;
    }
    return basePath;
  };

  return (
    <div className='absolute top-full z-10 mt-3 w-full rounded-xl bg-light-800 py-5 shadow-sm dark:bg-dark-400'>
      {/* <p className='text-dark400_light900 paragraph-semibold px-5'>
        Filters
      </p> */}
      <GlobalFilters />
      {/* divider line */}
      <div className='my-5 h-px bg-light-700/50 dark:bg-dark-500/50' />
      <div className='space-y-5'>
        <p className='text-dark400_light900 paragraph-semibold px-5'>
          Top Match
        </p>
        {error ? (
          <div className='flex-center flex-col px-5'>
            <p className='paragraph-semibold px-5 py-2.5 text-red-500'>Some error occured. Please try global search later.</p>
          </div>
        ) : loading ? (
          <div className='flex-center flex-col px-5'>
            <ReloadIcon className='my-2 size-10 animate-spin text-primary-500' />
            <p className='text-dark200_light800 paragraph-regular'>Browsing the entire database</p>
          </div>
        ) : (
          <div className='flex flex-col gap-2'>
            {result.length > 0 ? (
              result.map((item: any, index: number) => (
                <div key={item.type + item.id + index}>
                  <Link className='flex w-full cursor-pointer items-start gap-3 px-5 py-2.5 duration-300 ease-in-out hover:bg-light-700/50 dark:hover:bg-dark-500/50' href={renderLink(item.type, item.id)}>
                    <Image src="/assets/icons/tag.svg" alt="tags" width={18} height={18} className='invert-colors mt-1 object-contain' />
                    <div className='flex flex-col'>
                      <p className='paragraph-medium text-dark200_light800 line-clamp-1'>{item.title}</p>
                      <p className='text-light400_light500 small-medium mt-1 font-bold capitalize'>{item.type}</p>
                    </div>
                  </Link>
                </div>
              ))
            ) : (
              <div className='flex-center flex-col px-5'>
                <p className='text-dark200_light800 paragraph-regular px-5 py-2.5'>No results found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div >
  )
}

export default GlobalResult