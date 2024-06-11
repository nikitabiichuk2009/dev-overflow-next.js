import Link from 'next/link';
import React from 'react';
import { Badge } from '../ui/badge';


interface Props {
  id: string;
  name: string;
  questions: string[];
}

const TagCard = ({ id, name, questions }: Props) => {
  return (
    <div className='shadow-light100_darknone w-full md:w-[260px]'>
      <Link href={`/tags/${id}`}>
        <div className='background-light850_dark200 light-border flex h-[150px] flex-col justify-start gap-[18px] rounded-2xl border p-8 dark:border-none'>
          <Badge className={`subtle-medium text-light400_light500 background-light800_dark300 w-fit rounded-md border-none px-4 py-2 font-inter uppercase`}>{name}</Badge>
          <p className='paragraph-regular text-dark200_light900'><span className='text-[20px] font-bold text-primary-500'>{questions.length}+ </span>Questions</p>
        </div>
      </Link>
    </div>

  );
}

export default TagCard;
