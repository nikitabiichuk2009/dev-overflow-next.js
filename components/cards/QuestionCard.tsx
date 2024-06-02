import Link from 'next/link';
import React from 'react'
import Tag from '../shared/Tag';
import Metric from '../shared/Metric';
import { formatLargeNumber, getTimestamp } from '@/lib/utils';

interface Props {
  id: string;
  title: string;
  tags: { _id: string; name: string }[];
  author: {
    _id: string,
    clerkId: string;
    name: string,
    picture: string
  };
  upvotes: Array<object>;
  answers: Array<object>;
  views: number;
  createdAt: Date;
}

const QuestionCard = ({ id, title, tags, author, upvotes, answers, views, createdAt }: Props) => {
  return (
    <div className='card-wrapper rounded-[10px] p-9 sm:px-11'>
      <div className='flex flex-col-reverse items-start justify-between gap-5 sm:flex-row'>
        <div>
          <span className='small-medium text-dark400_light700 line-clamp-1 sm:hidden'>{getTimestamp(createdAt)}</span>
          <Link href={`/question/${id}`}>
            <h3 className='sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1'>{title}</h3>
          </Link>
        </div>
      </div>
      <div className='mt-3.5 flex flex-wrap gap-2'>
        {tags.map((tag) => {
          return <Tag key={tag._id} id={tag._id} title={tag.name}
            classNameSizeCustom="subtle-medium uppercase px-4 py-2"
            classNameBgCustom='background-light800_dark300Tag'
          />
        })}
      </div>
      <div className='flex-between mt-6 w-full flex-wrap gap-3'>
        <Metric imgUrl={author.picture} alt="user" value={author.name} title={` - asked ${getTimestamp(createdAt)}`} isAuthor href={`/profile/${author.clerkId}`} textStyles="body-medium text-dark400_light700" />
        <div className="flex items-center gap-3 max-sm:flex-wrap max-sm:justify-start">
          <Metric imgUrl="/assets/icons/like.svg" alt="upvotes" value={formatLargeNumber(upvotes.length) || 0} title={` ${upvotes.length === 1 ? "Vote" : "Votes"}`} textStyles="small-medium text-dark400_light800" />
          <Metric imgUrl="/assets/icons/message.svg" alt="message" value={formatLargeNumber(answers.length) || 0} title={` ${answers.length === 1 ? "Answer" : "Answers"}`} textStyles="small-medium text-dark400_light800" />
          <Metric imgUrl="/assets/icons/eye.svg" alt="views" value={formatLargeNumber(views) || 0} title={` ${views === 1 ? "View" : "Views"}`} textStyles="small-medium text-dark400_light800" />
        </div>
      </div>
    </div>
  )
}

export default QuestionCard
