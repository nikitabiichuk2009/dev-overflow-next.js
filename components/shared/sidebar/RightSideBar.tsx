import Image from 'next/image';
import Link from 'next/link';
import React from 'react'
import Tag from '../Tag';

const RightSideBar = () => {
  const hotQuestions = [
    {
      _id: '1',
      title: "Best practices for data fetching in a Next.js application with Server-Side Rendering (SSR)?"
    },
    {
      _id: '2',
      title: "Is it only me or the font is bolder than necessary?"
    },
    {
      _id: '3',
      title: "Redux Toolkit Not Updating State as Expected"
    },
    {
      _id: '4',
      title: "Can I get the course for free?"
    },
    {
      _id: '5',
      title: "Async/Await Function Not Handling Errors Properly"
    }
  ];
  const popularTags = [
    {
      _id: '1',
      name: "JAVA SCRIPT",
      count: 32
    },
    {
      _id: '2',
      name: "TEST",
      count: 19
    },
    {
      _id: '3',
      name: "REACT",
      count: 17
    },
    {
      _id: '4',
      name: "CSS",
      count: 13
    },
    {
      _id: '5',
      name: "NEXT JS",
      count: 9
    }
  ];

  return (
    <section className='custom-scrollbar light-border background-light900_dark200 sticky right-0 top-0 flex h-screen 
     w-[350px] flex-col
    overflow-y-auto rounded-sm border-l p-6 pt-36 shadow-light-300 dark:shadow-none max-xl:hidden'>
      <div>
        <h3 className='h3-bold text-dark200_light900'>Top Questions</h3>
        <div className='mt-7 flex w-full flex-col gap-1'>
          {hotQuestions.map((question) => {
            return <Link key={question._id} href={`/questions/${question._id}`} className='flex cursor-pointer items-center justify-between gap-7 rounded-md p-3 hover:bg-light-800 dark:hover:bg-dark-300'>
              <p className='body-medium text-dark500_light700'>{question.title}</p>
              <Image src="/assets/icons/chevron-right.svg" width={20} height={20} className='invert-colors' alt="" />
            </Link>
          })}
        </div>
      </div>
      <div className='mt-12'>
        <h3 className='h3-bold text-dark200_light900'>Popular Tags</h3>
        <div className='mt-7 flex flex-col gap-4'>
          {popularTags.map((tag) => {
            return <Tag key={tag._id} id={tag._id} title={tag.name} showCount={true} totalNumCount={tag.count} classNameSizeCustom="subtle-medium uppercase px-4 py-2" classNameBgCustom='background-light800_dark300Tag' />
          })}
        </div>
      </div>
    </section>
  )
}

export default RightSideBar
