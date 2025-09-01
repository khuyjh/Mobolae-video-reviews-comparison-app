import CategoryMenu from '@/features/mainPage/components/CategoryMenu';
import ContentList from '@/features/mainPage/components/contentList';
import FloatingButton from '@/features/mainPage/components/FloatingButton';
import MostReviewed from '@/features/mainPage/components/MostReviewed';
import {
  ReviewerRankingHorizontal,
  ReviewerRankingSidebar,
} from '@/features/mainPage/components/ReviewerRanking';
import TopShowcase from '@/features/mainPage/components/TopShowcase';
import { mockContents } from '@/features/mainPage/mock/mockContents';

import type { ProductOrderKey } from '@/shared/types/SortDropdownTypes';

type HomeProps = {
  searchParams: {
    category?: string;
    keyword?: string;
    order?: ProductOrderKey;
  };
};

export default function Home({ searchParams }: HomeProps) {
  const { category, keyword } = searchParams;
  const hasFilter = Boolean(category || (keyword && keyword.trim()));

  return (
    <main className='mx-auto w-full max-w-[1540px] px-5 md:px-[30px]'>
      <FloatingButton />

      <div className='flex'>
        {/* 좌측: 카테고리 메뉴 (md↑) */}
        <aside
          id='desktop-category-slot'
          className='hidden md:block'
          aria-label='카테고리 내비게이션'
        />

        {/* 가운데: 메인 콘텐츠 */}
        <section
          aria-labelledby='main-title'
          className='mt-[30px] min-h-[60vh] min-w-0 flex-1 px-5 md:mt-10 md:px-[30px] xl:mt-[60px] xl:px-[43px]'
        >
          <h1 id='main-title' className='sr-only'>
            메인 콘텐츠
          </h1>

          {/* 태블릿(md) 전용: 메인 상단에 가로형 랭킹 */}
          <div className='mb-[60px] lg:hidden'>
            <ReviewerRankingHorizontal />
          </div>

          {hasFilter ? (
            // 검색어나 카테고리가 있을 때만 리스트 렌더 (클라이언트 컴포넌트)
            <ContentList />
          ) : (
            // 없으면 Top/Most만 SSR로 렌더
            <>
              <TopShowcase items={mockContents} />
              <MostReviewed items={mockContents} />
            </>
          )}
        </section>

        {/* 우측: 랭킹 사이드바 (lg↑) */}
        <div className='hidden flex-none lg:block'>
          <ReviewerRankingSidebar />
        </div>
      </div>

      {/* 전역 카테고리 메뉴 (클라이언트 컴포넌트) */}
      <CategoryMenu />
    </main>
  );
}
