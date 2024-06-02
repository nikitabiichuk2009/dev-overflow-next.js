import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Button } from '../ui/button'

interface Props { title: string, description: string, buttonTitle: string, href: string }

const NoResults = ({ title, description, buttonTitle, href }: Props) => {
  return (
    <div className='mt-10 flex w-full flex-col items-center justify-center'>
      <Image
        src="/assets/images/light-illustration.png"
        alt="No results found!"
        width={270}
        height={200}
        className='block object-contain dark:hidden'
      />
      <Image
        src="/assets/images/dark-illustration.png"
        alt="No results found!"
        width={270}
        height={200}
        className='hidden object-contain dark:flex'
      />
      <h2 className='h2-bold text-dark200_light900 mt-8'>{title}</h2>
      <p className='body-regular text-dark500_light700 my-3.5 max-w-md text-center'>{description}</p>
      <Link href={href} className="flex justify-end max-sm:w-full">
        <Button className="mt-5 min-h-[46px] w-full bg-primary-500 px-4 py-3 font-semibold !text-light-900 shadow-md transition-colors duration-300 ease-out hover:bg-[#FF6000] dark:shadow-none sm:w-fit">{buttonTitle}</Button>
      </Link>
    </div>
  )
}

export default NoResults
