import { SignUp } from '@clerk/nextjs';
import React from 'react'

const SigUpPage = () => {
  return (
    <main className='flex-center flex h-screen w-full'>
      <SignUp />
    </main>
  )
}

export default SigUpPage;
