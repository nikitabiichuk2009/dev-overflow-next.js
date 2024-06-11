import Image from 'next/image';
import React from 'react'


const StatsCard = ({ questionsCount, answersCount }: { questionsCount: number, answersCount: number }) => {
  return (
    <div className="light-border background-light900_dark200 shadow-light100_darknone flex h-[90px] w-full flex-col items-center justify-center rounded-lg border p-5 md:w-[257px]">
      <div className="flex w-full justify-between px-4">
        <div className="flex flex-col items-start">
          <span className="paragraph-semibold text-dark200_light900">{questionsCount}</span>
          <span className="text-dark400_light700 body-medium">{questionsCount === 1 ? "Question" : "Questions"}</span>
        </div>
        <div className="flex flex-col items-start">
          <span className="paragraph-semibold text-dark200_light900">{answersCount}</span>
          <span className="text-dark400_light700 body-medium">{answersCount === 1 ? "Answer" : "Answers"}</span>
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

const Stats = ({ questionsCount, totalReputation, answersCount, diamondBadgesAmount, goldBadgesAmount, silverBadgesAmount, bronzeBadgesAmount }: { questionsCount: number, answersCount: number, goldBadgesAmount: number, silverBadgesAmount: number, bronzeBadgesAmount: number, diamondBadgesAmount: number, totalReputation: number }) => {
  return (
    <div className='mt-10'>
      <h3 className='h3-semibold text-dark200_light900 mb-4'>Stats - {totalReputation}</h3>
      <p className='mb-7 mt-3.5 font-spaceGrotesk text-[16px] font-normal leading-[19.6px] text-light-500'>
        Earn badges by accumulating reputation points through your contributions:
        <ul className="mt-1 list-inside list-disc text-[14px]">
          <li>Bronze Badge 🥉: Earned every 50 reputation points.</li>
          <li>Silver Badge 🥈: Earned every 300 reputation points.</li>
          <li>Gold Badge 🥇: Earned every 500 reputation points.</li>
          <li>Diamond Badge 💎: Earned every 1000 reputation points.</li>
        </ul>
        Increase your reputation by asking questions, providing helpful answers, and receiving upvotes from the community. Be active, stay engaged, and watch your reputation grow! 🌟🚀
      </p>

      <div className='flex flex-wrap gap-4'>
        <StatsCard questionsCount={questionsCount} answersCount={answersCount} />
        <ReputationCard
          title={diamondBadgesAmount === 1 ? 'Diamond Badge' : 'Diamond Badges'}
          imgUrl="/assets/icons/diamond-medal.svg"
          amount={diamondBadgesAmount}
        />
        <ReputationCard
          title={goldBadgesAmount === 1 ? 'Gold Badge' : 'Gold Badges'}
          imgUrl="/assets/icons/gold-medal.svg"
          amount={goldBadgesAmount}
        />
        <ReputationCard
          title={silverBadgesAmount === 1 ? 'Silver Badge' : 'Silver Badges'}
          imgUrl="/assets/icons/silver-medal.svg"
          amount={silverBadgesAmount}
        />
        <ReputationCard
          title={bronzeBadgesAmount === 1 ? 'Bronze Badge' : 'Bronze Badges'}
          imgUrl="/assets/icons/bronze-medal.svg"
          amount={bronzeBadgesAmount}
        />

      </div>
    </div>
  )
}

export default Stats;