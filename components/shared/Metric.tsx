import Image from 'next/image';
import Link from 'next/link';
import React from 'react'
interface MetricProps {
  imgUrl: string;
  alt: string;
  title: string;
  value: string | number;
  href?: string;
  textStyles?: string;
  isAuthor?: boolean;
}



const Metric = ({ imgUrl, alt, value, title, textStyles, href, isAuthor }: MetricProps) => {
  const metricContent = (
    <>
      {isAuthor ?
        <div className="relative size-5 overflow-hidden rounded-full">
          <Image src={imgUrl} alt={alt} layout="fill" objectFit="cover" />
        </div>
        :
        <Image src={imgUrl} alt={alt} height={20} width={20} className={`object-contain ${href ? "rounded-full" : ''}`} />
      }
      <p className={`${textStyles} flex items-center gap-1`}>
        {value}
        <span className={`small-regular line-clamp-1 ${isAuthor ? "max-sm:hidden" : ""}`}>
          {title}
        </span>
      </p></>
  )

  if (href) {
    return <Link href={href} className='flex-center gap-1'>
      {metricContent}
    </Link>
  }
  return (
    <div className='flex-center flex-wrap gap-1'>
      {metricContent}
    </div>
  )
}

export default Metric
