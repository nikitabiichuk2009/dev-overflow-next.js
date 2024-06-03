import { getUserTags } from '@/lib/actions/user.actions';
import React from 'react'
import NoResults from '../shared/NoResults';
import Tag from '../shared/Tag';
import { SearchParamsProps } from '@/types';

interface TagInterface {
  _id: string;
  name: string;
  questions: string[];
}

interface Props extends SearchParamsProps {
  userId: string
}

const TagsTab = async ({ searchProps, userId }: Props) => {
  let tags;
  try {
    const tagsInitial = await getUserTags({ userId });

    tags = JSON.parse(JSON.stringify(tagsInitial));
  } catch (error) {
    console.log(error);
    return (
      <div>
        <h1 className="h1-bold text-dark100_light900">Error</h1>
        <NoResults
          title="Error fetching user' questions"
          description="There was an error fetching the user's questions.Try to reload the page or press the button to go back. If that didn't help, Please try again later."
          buttonTitle="Go back"
          href="../"
        />
      </div>
    );
  }

  return (
    <>
      {tags.length > 0 ?
        <div className='mt-7 flex flex-col gap-4'>
          {tags.map((tag: TagInterface) => (
            <Tag key={tag._id} id={tag._id} countStyles='paragraph-semibold' title={tag.name} showCount={true} totalNumCount={tag.questions.length} classNameSizeCustom="subtle-medium uppercase px-4 py-2" classNameBgCustom='background-light800_dark300Tag' />
          ))}
        </div>
        : <p className='paragraph-semibold text-dark200_light900'>The user has not used any tags yet.</p>
      }</>
  )
}

export default TagsTab