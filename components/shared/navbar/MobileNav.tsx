'use client';
import React from 'react';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import Image from 'next/image';
import Link from 'next/link';
import { SignedOut, SignedIn, useClerk, useAuth } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { sidebarLinks } from '@/constants';
import { usePathname } from 'next/navigation';

const NavContent = () => {
  const pathName = usePathname();
  const { userId } = useAuth();
  return (
    <section className='flex flex-col gap-6'>
      {sidebarLinks.map((link) => {
        const isActive = pathName === link.route || (link.label !== "Home" && pathName.startsWith(link.route));
        const route = link.label === 'Profile' ? `/profile/${userId}` : link.route;
        if (link.label === 'Profile' && !userId) return null; // Conditionally render profile link
        return (
          <SheetClose asChild key={link.imgURL}>
            <Link
              href={route}
              className={`${isActive ? "primary-gradient text-light-900" : "text-dark300_light900"} 
                flex items-center justify-start gap-4 rounded-lg bg-transparent p-4 hover:bg-light-800 dark:hover:bg-dark-300`}>
              <Image src={link.imgURL} alt={link.label} width={20} height={20} className={`${isActive ? "" : "invert-colors"}`} />
              <p className={`${isActive ? "base-bold" : "base-medium"}`}>{link.label}</p>
            </Link>
          </SheetClose>)
      })}
    </section>
  )
}

const MobileNav = () => {
  const { signOut } = useClerk();
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Image src="/assets/icons/hamburger.svg"
          alt="Hamburger menu" width={36} height={36}
          className='invert-colors cursor-pointer sm:hidden' />
      </SheetTrigger>
      <SheetContent side='left' className='background-light900_dark200 flex flex-col justify-between'>
        <div className='flex flex-1 flex-col'>
          <Link href="/" className='mb-6 flex items-center gap-1'>
            <Image src="/assets/images/site-logo.svg" width={30} height={30} alt="DevFlow" />
            <p className='h2-bold text-dark100_light900 font-spaceGrotesk'>Dev
              <span className='text-primary-500'>Flow</span>
            </p>
          </Link>
          <NavContent />
        </div>
        <div className='flex flex-col gap-5'>
          <SignedOut>
            <div className='flex flex-col gap-3'>
              <SheetClose asChild>
                <Link href="/sign-in">
                  <Button className='btn-secondary min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none'>
                    <span className='h3-bold primary-text-gradient'>Log In</span>
                  </Button>
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link href="/sign-up">
                  <Button className='btn-tertiary min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none'>
                    <span className='h3-bold text-dark400_light900'>Sign Up</span>
                  </Button>
                </Link>
              </SheetClose>
            </div>
          </SignedOut>
          <SignedIn>
            <SheetClose asChild>
              <Button onClick={() => signOut({ redirectUrl: '/' })} className='btn-tertiary min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none'>
                <span className='h3-bold text-dark400_light900'>Log Out</span>
              </Button>
            </SheetClose>
          </SignedIn>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default MobileNav;
