import Link from 'next/link'
import React from 'react'
import { Badge } from '../ui/badge'

const Tag = ({ id, title, showCount, totalNumCount, classNameBgCustom, classNameSizeCustom, countStyles }: { id: string, title: string, showCount?: boolean, totalNumCount?: number, classNameBgCustom: string, classNameSizeCustom: string, countStyles?: string }) => {
  return (
    <Link href={`/tags/${id}`} className='flex justify-between gap-2'>
      <Badge className={`${classNameSizeCustom} text-light400_light500 rounded-md border-none ${classNameBgCustom}`}>{title}</Badge>
      {showCount && <p className={`${countStyles || "subtle-medium"} text-dark500_light700`}>{totalNumCount}</p>}
    </Link>
  )
}

export default Tag
