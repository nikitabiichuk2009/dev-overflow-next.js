import React from 'react'
import GlobalButton from './GlobalButton'

const GlobalFilters = () => {
  return (
    <div className='flex flex-row items-center'>
      <p className='text-dark400_light900 paragraph-semibold px-5'>
        Type:
      </p>
      <div className='flex flex-row gap-3'>
        <GlobalButton text="Question" />
        <GlobalButton text="Answer" />
        <GlobalButton text="User" />
        <GlobalButton text="Tag" />
      </div>
    </div>
  )
}

export default GlobalFilters