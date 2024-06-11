import Image from 'next/image';
import Link from 'next/link';
import React from 'react'
import Tag from '../Tag';
import { getPopularTags } from '@/lib/actions/tag.actions';
import { getPopularQuestions } from '@/lib/actions/question.actions';

interface TagInterface {
  _id: string;
  name: string;
  questions: string[];
}

interface Question {
  _id: string;
  title: string;
  tags: { _id: string; name: string }[];
  author: { _id: string; name: string; picture: string };
  upvotes: number;
  answers: any[];
  views: number;
  createdAt: Date;
}

const RightSideBar = async () => {
  const popularTags = await getPopularTags();
  const popularTagsParsed = JSON.parse(JSON.stringify(popularTags?.tags));
  const questions = await getPopularQuestions();
  const hotQuestions = JSON.parse(JSON.stringify(questions?.questions));

  return (
    <section className='custom-scrollbar light-border background-light900_dark200 sticky right-0 top-0 flex h-screen 
     w-[350px] flex-col
    overflow-y-auto rounded-sm border-l p-6 pt-36 shadow-light-300 dark:shadow-none max-xl:hidden'>
      <div>
        {hotQuestions.length > 0 ? (
          <>
            <h3 className='h3-bold text-dark200_light900'>Recent Questions</h3>
            <div className='mt-7 flex w-full flex-col gap-1'>
              {hotQuestions.map((question: Question) => (
                <Link key={question._id} href={`/question/${question._id}`} className='flex cursor-pointer items-center justify-between gap-7 rounded-md p-3 hover:bg-light-800 dark:hover:bg-dark-300'>
                  <p className='body-medium text-dark500_light700 line-clamp-3'>{question.title}</p>
                  <Image src="/assets/icons/chevron-right.svg" width={20} height={20} className='invert-colors' alt="" />
                </Link>
              ))}
            </div>
          </>
        ) : (
          <h3 className='h3-bold text-dark200_light900'>No Recent Questions</h3>
        )}
      </div>
      <div className='mt-12'>
        {popularTagsParsed.length > 0 ? (
          <>
            <h3 className='h3-bold text-dark200_light900'>Popular Tags</h3>
            <div className='mt-7 flex flex-col gap-4'>
              {popularTagsParsed.map((tag: TagInterface) => (
                <Tag key={tag._id} id={tag._id} title={tag.name} showCount={true} totalNumCount={tag.questions.length} classNameSizeCustom="subtle-medium uppercase px-4 py-2" classNameBgCustom='background-light800_dark300Tag' />
              ))}
            </div>
          </>
        ) : (
          <h3 className='h3-bold text-dark200_light900'>No Popular Tags</h3>
        )}
      </div>
    </section>
  )
}

export default RightSideBar;
