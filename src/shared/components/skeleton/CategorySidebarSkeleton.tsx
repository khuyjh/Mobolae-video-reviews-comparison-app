'use client';

const CategorySidebarSkeleton = () => {
  return (
    <aside className='bg-black-900 mr-5 h-fit max-w-[220px] min-w-[180px] self-start px-[10px] py-[45px] md:sticky md:top-20 md:max-h-[calc(100vh-80px)] md:overflow-auto xl:min-w-[220px]'>
      <div className='bg-black-700/60 mb-5 h-5 w-20 animate-pulse rounded' />
      <div className='space-y-2'>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className='bg-black-700/60 h-10 animate-pulse rounded-lg' />
        ))}
      </div>
    </aside>
  );
};

export default CategorySidebarSkeleton;
