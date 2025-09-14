'use client';

type Direction = 'row' | 'col';

const SkeletonItem = () => (
  <div className='flex min-w-[147px] flex-none shrink-0 items-center gap-3'>
    <div className='bg-black-700/60 h-[42px] w-[42px] animate-pulse rounded-full' />
    <div className='flex flex-col gap-2'>
      <div className='bg-black-700/60 h-4 w-[94px] animate-pulse rounded' />
      <div className='bg-black-700/60 h-3 w-[60px] animate-pulse rounded' />
    </div>
  </div>
);

const ReviewerRankingSkeleton = ({ direction = 'col' }: { direction?: Direction }) => {
  const items = Array.from({ length: 5 }).map((_, i) => <SkeletonItem key={i} />);

  if (direction === 'row') {
    return (
      <section>
        <div className='bg-black-700/60 mb-3 h-5 w-24 animate-pulse rounded' />
        <div
          role='list'
          className='flex w-full flex-nowrap gap-5 overflow-x-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'
        >
          {items}
        </div>
      </section>
    );
  }

  return (
    <aside className='h-fit px-[30px] py-[45px] md:sticky md:top-20 md:max-h-[calc(100vh-80px)] md:max-w-[250px] md:min-w-[250px] md:overflow-auto'>
      <div className='bg-black-700/60 mb-[30px] h-5 w-24 animate-pulse rounded' />
      <div className='space-y-[30px]'>{items}</div>
    </aside>
  );
};

export default ReviewerRankingSkeleton;
