'use client'
import React from 'react'
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SelectGroup, SelectItem } from '@radix-ui/react-select'

interface Props {
  filters: {
    name: string,
    value: string
  }[],
  otherClasses?: string,
  containerClasses?: string
}

const Filter = ({ filters, otherClasses, containerClasses }: Props) => {
  return (
    <div className={`relative ${containerClasses}`}>
      <Select>
        <SelectTrigger className={`${otherClasses} body-regular light-border background-light800_dark300 text-dark500_light700 border px-5 py-2.5`}>
          <div className='line-clamp-1 flex-1 text-left'>
            <SelectValue placeholder="Select a filter" />
          </div>
        </SelectTrigger>
        <SelectContent className='rounded border bg-light-900
          dark:border-dark-400 dark:bg-dark-300'>
          <SelectGroup className='flex flex-col p-1'>
            {filters.map((item) => {
              return <SelectItem key={item.value} value={item.value} className='text-dark100_light900 cursor-pointer rounded-sm p-2 hover:border-none hover:shadow-none hover:outline-none hover:ring-0 focus:bg-light-800 dark:focus:bg-dark-300'>{item.name}</SelectItem>
            })}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}

export default Filter
