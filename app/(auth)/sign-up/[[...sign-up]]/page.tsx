'use client'
import { SignUp } from '@clerk/nextjs';
import React from 'react'
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
const SigUpPage = () => {
  const router = useRouter()
  return (
    <main className='flex-center flex h-screen w-full flex-col gap-6'>
      <Button onClick={() => router.push("../")}
        className='mb-2 me-2 rounded-lg bg-blue-700 px-5 py-2.5 text-lg
        font-semibold text-white hover:bg-blue-800 dark:bg-blue-600
         dark:hover:bg-blue-700'>Back</Button>
      <SignUp />
    </main>
  )
}

export default SigUpPage;
