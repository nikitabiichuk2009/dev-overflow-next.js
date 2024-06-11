import EditProfileForm from '@/components/forms/EditProfileForm'
import NoResults from '@/components/shared/NoResults';
import { getUserById } from '@/lib/actions/user.actions';
import { auth } from '@clerk/nextjs/server'
import { Metadata } from 'next';
import React from 'react'

export const metadata: Metadata = {
  title: "Devflow | Edit a Profile Page",
  description: "Edit a profile page of Devflow",
  icons: {
    icon: "/assets/images/site-logo.svg",
  },
};

const Page = async ({ params }: any) => {
  const { userId } = auth();

  if (!userId) {
    return (
      <div>
        <h1 className="h1-bold text-dark100_light900">403 code. Access is forbidden.</h1>
        <NoResults
          title="You are not logged in"
          description="You must be logged in to edit your profile. Please log in and try again."
          buttonTitle="Sign In"
          href="/sign-in"
        />
      </div>
    );
  }

  if (params.id !== userId) {
    return (
      <div>
        <h1 className="h1-bold text-dark100_light900">403 code. Access is forbidden.</h1>
        <NoResults
          title="You are not the profile owner"
          description="You do not have permission to edit this profile. Please ensure you are logged in with the correct account. If you believe this is an error, contact support (niktestpython@gmail.com) for further assistance."
          buttonTitle="Go back"
          href={`/profile/${params.id}`}
        />
      </div>
    );
  }

  let initialValues;
  try {
    const user = await getUserById({ userId });
    const userParsed = JSON.parse(JSON.stringify(user));
    initialValues = {
      bio: userParsed.bio || "",
      portfolio: userParsed.portfolio || "",
      location: userParsed.location || "",
    }

  } catch (err) {
    console.log(err);
    return (
      <div>
        <h1 className="h1-bold text-dark100_light900">Error</h1>
        <NoResults
          title="Error fetching user data"
          description="There was an error fetching your profile data. Please try again later."
          buttonTitle="Go back"
          href="/"
        />
      </div>
    );
  }
  return (
    <div>
      <h1 className='h1-bold text-dark100_light900'>Edit your Profile</h1>
      <div className='mt-9'>
        <EditProfileForm initialValues={initialValues} userClerkId={params.id} />
      </div>
    </div>
  )
}

export default Page