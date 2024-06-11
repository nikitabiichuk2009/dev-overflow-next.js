import { Skeleton } from '@/components/ui/skeleton';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Devflow | Log In/Sign Up Page",
  description: "Log In/Sign Up page of Devflow",
  icons: {
    icon: "/assets/images/site-logo.svg",
  },
};

const Loading = () => {
  return (
    <>
      <main className='flex-center flex min-h-screen w-full flex-col gap-6 bg-auth-light bg-cover bg-center bg-no-repeat dark:bg-auth-dark'>
        <Skeleton className='mb-2 h-12 w-24' />
        <div className="w-full max-w-sm rounded-lg bg-white p-4 shadow-md dark:bg-gray-800">
          <Skeleton className="mb-4 h-8" />
          <Skeleton className="mb-2 h-12" />
          <Skeleton className="mb-2 h-12" />
          <Skeleton className="mb-2 h-12" />
          <Skeleton className="mb-2 h-12" />
          <Skeleton className="mt-4 h-6" />
        </div>
      </main>
    </>
  );
};

export default Loading;
