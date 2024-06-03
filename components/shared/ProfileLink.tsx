import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

interface ProfileProps {
  imgUrl: string;
  alt: string;
  title: string;
  href?: string
}

const ProfileLink = ({ imgUrl, href, alt, title }: ProfileProps) => {
  return (
    <div className='flex-center gap-1'>
      <Image src={imgUrl} alt={alt} width={20} height={20} />
      {href ?
        <Link href={href} target='_blank' className='paragraph-medium text-blue-500 hover:text-blue-600'>{title}</Link>
        :
        <p className='text-dark400_light700 paragraph-medium'>{title}</p>}
    </div>
  )
}

export default ProfileLink
