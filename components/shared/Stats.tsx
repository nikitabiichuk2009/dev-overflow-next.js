import Image from 'next/image';
import React from 'react'


const StatsCard = ({ questionsCount, answersCount }: { questionsCount: number, answersCount: number }) => {
  return (
    <div className="light-border background-light900_dark200 shadow-light100_darknone flex h-[90px] w-full flex-col items-center justify-center rounded-lg border p-5 md:w-[257px]">
      <div className="flex w-full justify-between px-4">
        <div className="flex flex-col items-start">
          <span className="paragraph-semibold text-dark200_light900">{questionsCount}</span>
          <span className="text-dark400_light700 body-medium">Questions</span>
        </div>
        <div className="flex flex-col items-start">
          <span className="paragraph-semibold text-dark200_light900">{answersCount}</span>
          <span className="text-dark400_light700 body-medium">Answers</span>
        </div>
      </div>
    </div>
  );
};

const ReputationCard = ({ title, imgUrl, amount }: { title: string, imgUrl: string, amount: number }) => {
  return (
    <div className="shadow-light100_darknone background-light900_dark200 light-border flex h-[90px] w-full items-center gap-4 rounded-lg border p-5 md:w-[257px]">
      <Image src={imgUrl} alt={title} width={40} height={40} />
      <div>
        <span className="paragraph-semibold text-dark200_light900">{amount}</span>
        <p className="text-dark400_light700 body-medium">{title}</p>
      </div>
    </div>
  );
};

const Stats = ({ questionsCount, answersCount, goldBadgesAmount, silverBadgesAmount, bronzeBadgesAmount }: { questionsCount: number, answersCount: number, goldBadgesAmount: number, silverBadgesAmount: number, bronzeBadgesAmount: number }) => {
  return (
    <div className='mt-10'>
      <h3 className='h3-semibold text-dark200_light900 mb-4'>Stats</h3>
      <div className='flex flex-wrap gap-4'>
        <StatsCard questionsCount={questionsCount} answersCount={answersCount} />
        <ReputationCard title='Gold Badges' imgUrl="/assets/icons/gold-medal.svg" amount={goldBadgesAmount} />
        <ReputationCard title='Silver Badges' imgUrl="/assets/icons/silver-medal.svg" amount={silverBadgesAmount} />
        <ReputationCard title='Bronze Badges' imgUrl="/assets/icons/bronze-medal.svg" amount={bronzeBadgesAmount} />
      </div>
    </div>
  )
}

export default Stats;