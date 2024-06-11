'use client';
import React from 'react';
import { sidebarLinks } from '@/constants';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { SignedIn, SignedOut, useAuth, useClerk } from '@clerk/nextjs';
import { Button, useToast } from '@chakra-ui/react';

const LeftSideBar = () => {
  const toast = useToast();
  const { userId } = useAuth();
  const { signOut } = useClerk();
  const pathName = usePathname();

  return (
    <section className='custom-scrollbar light-border background-light900_dark200 sticky left-0 top-0 flex h-screen 
   flex-col justify-between overflow-y-auto
    rounded-sm border-r p-6 pt-36 shadow-light-300 dark:shadow-none max-sm:hidden lg:w-[266px]'>
      <div className='flex flex-1 flex-col gap-6'>
        {sidebarLinks.map((link) => {
          const isActive = pathName === link.route || (link.label !== "Home" && pathName.startsWith(link.route));
          const route = link.label === 'Profile' ? `/profile/${userId}` : link.route;
          if (link.label === 'Profile' && !userId) return null; // Conditionally render profile link
          return (
            <Link
              key={link.label}
              href={route}
              className={`${isActive ? "primary-gradient text-light-900" : "text-dark300_light900"} 
              flex items-center justify-start gap-4 rounded-lg bg-transparent p-4 transition-colors duration-300 ease-in-out hover:bg-light-800 dark:hover:bg-dark-400`}
            >
              <Image
                src={link.imgURL}
                alt={link.label}
                width={25}
                height={25}
                className={`${isActive ? "" : "invert-colors"}`}
              />
              <p className={`${isActive ? "base-bold" : "base-medium"} max-lg:hidden`}>{link.label}</p>
            </Link>
          );
        })}
      </div>
      <div className='flex flex-col gap-3'>
        <SignedOut>
          <Link href="/sign-in">
            <Button className='btn-secondary min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none'>
              <Image
                src="/assets/icons/account.svg"
                alt="login"
                width={25}
                height={25}
                className="invert-colors lg:hidden"
              />
              <span className='h3-bold primary-text-gradient max-lg:hidden'>Log In</span>
            </Button>
          </Link>
          <Link href="/sign-up">
            <Button className='btn-tertiary text-dark400_light900 min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none'>
              <Image
                src="/assets/icons/sign-up.svg"
                alt="sign up"
                width={25}
                height={25}
                className="invert-colors lg:hidden"
              />
              <span className='h3-bold text-dark400_light900 max-lg:hidden'>Sign Up</span>
            </Button>
          </Link>
        </SignedOut>
        <SignedIn>
          <Button
            onClick={() => {
              signOut({ redirectUrl: '/' })
              toast({
                title: 'Successfully logged out',
                status: 'success',
                isClosable: true,
              })
            }}
            className='btn-tertiary min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none'
          >
            <Image
              src="/assets/icons/logout.svg"
              alt="sign up"
              width={25}
              height={25}
              className="invert-colors lg:hidden"
            />
            <span className='h3-bold text-dark400_light900 max-lg:hidden'>Log Out</span>
          </Button>
        </SignedIn>
      </div>
    </section>
  );
};

export default LeftSideBar;
