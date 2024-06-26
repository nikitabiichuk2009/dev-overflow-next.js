import React from 'react';
import NoResults from '@/components/shared/NoResults';
import Filter from '@/components/shared/filters/Filter';
import LocalSearchBar from '@/components/shared/search/LocalSearchBar';
import { TagFilters } from '@/constants/filters';
import { getAllTags } from '@/lib/actions/tag.actions';
import TagCard from '@/components/cards/TagCard';
import { SearchParamsProps } from '@/types';
import Pagination from '@/components/Pagination';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Devflow | All Tags Page",
  description: "All tags page of Devflow",
  icons: {
    icon: "/assets/images/site-logo.svg",
  },
};

interface TagInterface {
  _id: string;
  name: string;
  questions: string[]
}

const Page = async ({ searchParams }: SearchParamsProps) => {
  const searchQuery = searchParams ? searchParams.q : "";
  const filter = searchParams ? searchParams.filter : "";
  const page = searchParams?.page ? +searchParams.page : 1;
  try {
    const result = await getAllTags({ searchQuery, filter, page });
    const tagsParsed = JSON.parse(JSON.stringify(result?.tags));
    const isNext = JSON.parse(JSON.stringify(result?.isNext));
    return (
      <div>
        <h1 className='h1-bold text-dark100_light900'>All tags</h1>
        <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
          <LocalSearchBar
            searchFor="Search for tags"
            iconPosition="left"
            route='/tags'
            imgSrc="/assets/icons/search.svg"
            otherClasses="flex-1"
          />
          <Filter
            filters={TagFilters}
            otherClasses="min-h-[56px] sm:min-w-[170px]"
          />
        </div>
        <div className='mt-12 flex flex-wrap gap-4'>
          {tagsParsed.length > 0 ? (
            tagsParsed.map((tag: TagInterface) => (
              <TagCard key={tag._id} id={tag._id} name={tag.name} questions={tag.questions} />
            ))
          ) : (
            <NoResults
              title={`There are no ${filter || ""} tags to show`}
              description="If there are no questions, it means there are no tags. Please ask a question to generate tags."
              buttonTitle='Ask a Question'
              href='/ask-question'
            />
          )}
        </div>
        <div className='mt-10'>
          <Pagination
            pageNumber={page}
            isNext={isNext}
          />
        </div>
      </div>
    );
  } catch (error) {
    console.error('Failed to fetch users or tags:', error);
    return (
      <div>
        <h1 className='h1-bold text-dark100_light900'>All tags</h1>
        <div className='mt-12 flex flex-wrap gap-4'>
          <NoResults
            title="Error fetching tags"
            description="There was an error fetching the tags. Try to reload the page or press the button to go back. If that didn't help, Please try again later."
            buttonTitle='Go back'
            href='../'
          />
        </div>
      </div>
    );
  }
}

export default Page;
