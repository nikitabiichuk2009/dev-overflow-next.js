import React from 'react';
import UserCard from '@/components/cards/UserCard';
import NoResults from '@/components/shared/NoResults';
import Filter from '@/components/shared/filters/Filter';
import LocalSearchBar from '@/components/shared/search/LocalSearchBar';
import { UserFilters } from '@/constants/filters';
import { getAllUsers } from '@/lib/actions/user.actions';
import { getTagsByUserId } from '@/lib/actions/tag.actions';
import { SearchParamsProps } from '@/types';

const Page = async ({ searchParams }: SearchParamsProps) => {
  const searchQuery = searchParams ? searchParams.q : "";
  const filter = searchParams ? searchParams.filter : "";
  try {
    const result = await getAllUsers({ searchQuery, filter });
    const usersParsed = JSON.parse(JSON.stringify(result?.users));
    // console.log(usersParsed)
    const usersWithTags = await Promise.all(
      usersParsed.map(async (user: any) => {
        const tags = await getTagsByUserId({ userId: user._id });
        return { ...user, tags };
      })
    );
    // console.log(usersWithTags)
    return (
      <div>
        <h1 className='h1-bold text-dark100_light900'>Our Community</h1>
        <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
          <LocalSearchBar
            searchFor="Search for friends"
            iconPosition="left"
            route='/community'
            imgSrc="/assets/icons/search.svg"
            otherClasses="flex-1"
          />
          <Filter
            filters={UserFilters}
            otherClasses="min-h-[56px] sm:min-w-[170px]"
          />
        </div>
        <div className='mt-12 flex flex-wrap gap-4'>
          {usersWithTags.length > 0 ? (
            usersWithTags.map((user) => (
              <UserCard
                key={user._id}
                id={user.clerkId}
                fullName={user.name}
                username={user.username}
                picture={user.picture}
                tags={user.tags.length > 0 ? user.tags : "No tags"}
              />
            ))
          ) : (
            <NoResults
              title="There are no users to show"
              description="Be the first to join our community! 🚀 Create a profile and start connecting with like-minded individuals. Your presence could be the spark that ignites new discussions and collaborations. Get involved and make a difference! 💡"
              buttonTitle='Sign up now'
              href='/sign-up'
            />
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error('Failed to fetch users or tags:', error);
    return (
      <div>
        <h1 className='h1-bold text-dark100_light900'>Our Community</h1>
        <div className='mt-12 flex flex-wrap gap-4'>
          <NoResults
            title="Error fetching users"
            description="There was an error fetching the users or their tags.Try to reload the page or press the button to go back. If that didn't help, Please try again later."
            buttonTitle='Go back'
            href='../'
          />
        </div>
      </div>
    );
  }
}

export default Page;
