import NoResults from '@/components/shared/NoResults';
import { Button } from '@/components/ui/button';
import { getUserById } from '@/lib/actions/user.actions';
import { SignedIn } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ProfileLink from '@/components/shared/ProfileLink';
import Stats from '@/components/shared/Stats';
import QuestionTab from '@/components/tabs/QuestionTab';
import AnswersTab from '@/components/tabs/AnswersTab';
import TagsTab from '@/components/tabs/TagsTab';
import { URLProps } from '@/types';

const Profile = async ({ params, searchParams }: URLProps) => {
  const { userId } = auth();
  if (!userId) {
    console.log("User isn't registered")
  }
  let userParsed;
  let formattedJoinedDate;
  try {
    const user = await getUserById({ userId: params.id });

    userParsed = JSON.parse(JSON.stringify(user));
    // console.log(userParsed);
    const joinedDate = new Date(userParsed.joinDate);
    formattedJoinedDate = joinedDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });

  } catch (error) {
    console.log(error);
    return (
      <div>
        <h1 className="h1-bold text-dark100_light900">Error</h1>
        <NoResults
          title="Error fetching user data"
          description="There was an error fetching the user data. Maybe the user you are looking for doesn't exist.Try to reload the page or press the button to go back. If that didn't help, Please try again later."
          buttonTitle="Go back"
          href="../"
        />
      </div>
    );
  }

  return (
    <>
      <div className='flex flex-col-reverse items-start justify-between sm:flex-row'>
        <div className='flex flex-col items-start gap-4 lg:flex-row'>
          <div>
            <div className='relative size-36'>
              <Image src={userParsed.picture} alt="user's avatar" layout="fill" className='max:sm:mt-0.5 rounded-full object-cover' />
            </div>
          </div>
          <div className='mt-3'>
            <h2 className='h2-bold text-dark100_light900'>{userParsed.name}</h2>
            <p className='text-dark200_light800 paragraph-regular'>@{userParsed.username}</p>
            <div className='mt-5 flex flex-wrap items-center justify-start gap-5'>
              {userParsed.portfolio && <ProfileLink imgUrl="/assets/icons/link.svg" alt="user-info-location" href={userParsed.portfolio} title="Portfolio" />}
              {userParsed.location && <ProfileLink imgUrl="/assets/icons/location.svg" alt="user-info-location" title={userParsed.location} />}
              <ProfileLink imgUrl="/assets/icons/calendar.svg" alt="user info joined date" title={`Joined ${formattedJoinedDate}`} />
            </div>
            {userParsed.bio && <p className='paragraph-semibold text-dark400_light800'>{userParsed.bio}</p>}
          </div>
        </div>
        <div className='flex justify-end max-sm:mb-5 max-sm:w-full sm:mt-3'>
          <SignedIn>
            {userId === userParsed.clerkId &&
              <Link href={`/profile/${params.id}/edit`}>
                <Button className="min-h-[46px] min-w-[175px] bg-primary-500  font-semibold !text-light-900 shadow-md transition-colors duration-300 ease-out hover:bg-[#FF6000] dark:shadow-none">Edit profile</Button>
              </Link>
            }
          </SignedIn>
        </div>
      </div>
      <Stats
        questionsCount={userParsed.questionsCount}
        answersCount={userParsed.answersCount}
        goldBadgesAmount={4}
        silverBadgesAmount={10}
        bronzeBadgesAmount={17}
      />
      <div className='mt-10 flex gap-10'>
        <Tabs defaultValue="top-posts" className="flex-1">
          <TabsList className='background-light800_dark400 min-h-[42px] p-1'>
            <TabsTrigger value="top-posts" className='tab'>Questions</TabsTrigger>
            <TabsTrigger value="answers" className='tab'>Answers</TabsTrigger>
            <TabsTrigger value="top-tags" className='tab'>Tags Used by User</TabsTrigger>
          </TabsList>
          <TabsContent value="top-posts">
            <QuestionTab searchParams={searchParams} userId={userParsed._id} />
          </TabsContent>
          <TabsContent value="answers">
            <AnswersTab searchParams={searchParams} userId={userParsed._id} />
          </TabsContent>
          <TabsContent value="top-tags">
            <TagsTab searchParams={searchParams} userId={userParsed._id} />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default Profile;
