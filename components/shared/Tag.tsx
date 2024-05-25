import Link from 'next/link'
import React from 'react'
import { Badge } from '../ui/badge'

const Tag = ({ id, title, showCount, totalNumCount, classNameBgCustom, classNameSizeCustom }: { id: string, title: string, showCount?: boolean, totalNumCount?: number, classNameBgCustom: string, classNameSizeCustom: string }) => {
  return (
    <Link href={`/tags/${id}`} className='flex justify-between gap-2'>
      <Badge className={`${classNameSizeCustom} text-light400_light500 rounded-md border-none ${classNameBgCustom}`}>{title}</Badge>
      {showCount && <p className='small-medium text-dark500_light700'>{totalNumCount}</p>}
    </Link>
  )
}

export default Tag
