import { Badge } from '../ui/badge';
import Tag from '../shared/Tag';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface TagType {
  _id: string;
  name: string;
}

interface Props {
  id: string;
  fullName: string;
  username: string;
  picture: string;
  tags: TagType[] | string;
}

const UserCard = ({ id, fullName, username, picture, tags }: Props) => {
  return (
    <div className='shadow-light100_darknone w-full md:w-[260px]'>
      <Link href={`/profile/${id}`}>
        <div className='background-light850_dark200 light-border flex h-[360px] flex-col items-center justify-center gap-[18px] rounded-2xl border p-8 dark:border-none'>
          <div className='relative size-28'>
            <Image src={picture} alt="user's avatar" layout="fill" className='rounded-full object-cover' />
          </div>
          <div className='mt-4 text-center'>
            <h3 className='h3-bold text-dark200_light900 line-clamp-1'>{fullName}</h3>
            <p className='body-regular text-dark500_light500 mt-2'>@{username}</p>
          </div>
          <div className='mt-2.5 flex flex-wrap justify-center gap-2 text-center'>
            {typeof tags === "string" ? (
              <Badge className={`subtle-medium text-light400_light500 background-light800_dark300 rounded-md border-none px-4 py-2 font-inter uppercase`}>No tags yet</Badge>
            ) : (
              tags.map((tag) => (
                <Tag key={tag._id} id={tag._id} title={tag.name}
                  classNameSizeCustom="subtle-medium uppercase px-4 py-2"
                  classNameBgCustom='background-light800_dark300Tag'
                />
              ))
            )}
          </div>
        </div>
      </Link>
    </div>

  );
}

export default UserCard;
