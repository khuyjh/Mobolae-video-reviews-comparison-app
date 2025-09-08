import { cookies } from 'next/headers';

import CategoryMenu from '@/features/mainPage/components/CategoryMenu';
import ContentList from '@/features/mainPage/components/ContentList';
import FloatingButton from '@/features/mainPage/components/FloatingButton';
import MostReviewed from '@/features/mainPage/components/MostReviewed';
import {
  ReviewerRankingHorizontal,
  ReviewerRankingSidebar,
} from '@/features/mainPage/components/ReviewerRanking';
import TopShowcase from '@/features/mainPage/components/TopShowcase';
import { mockContents } from '@/features/mainPage/mock/mockContents';

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const Home = async ({ searchParams }: PageProps) => {
  const sp = await searchParams;

  const accessToken = (await cookies()).get('accessToken')?.value; // ← get으로 읽기
  const isLoggedIn = Boolean(accessToken);

  // category, keyword 타입을 안전하게 string으로 변환
  const category =
    typeof sp.category === 'string'
      ? sp.category
      : Array.isArray(sp.category)
        ? sp.category[0]
        : undefined;

  const keyword =
    typeof sp.keyword === 'string'
      ? sp.keyword
      : Array.isArray(sp.keyword)
        ? sp.keyword[0]
        : undefined;

  const hasFilter = Boolean(category || (keyword && keyword.trim()));

  return (
    <main className='mx-auto w-full max-w-[1540px]'>
      {isLoggedIn && <FloatingButton />}

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
          className='mt-[30px] min-h-[60vh] min-w-0 flex-1 md:mt-10 xl:mt-[60px]'
        >
          <h1 id='main-title' className='sr-only'>
            메인 콘텐츠
          </h1>

          {/* 태블릿, 모바일: 메인 상단에 가로형 랭킹 */}
          <div className='mb-[60px] pl-5 md:pl-[30px] lg:hidden'>
            <ReviewerRankingHorizontal />
          </div>
          <div className='px-5 md:px-[30px] xl:px-[60px]'>
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
          </div>
        </section>

        {/* 우측: 랭킹 사이드바 (lg↑) */}
        <div className='border-black-800 hidden flex-none border-l lg:block'>
          <ReviewerRankingSidebar />
        </div>
      </div>

      {/* 전역 카테고리 메뉴 (클라이언트 컴포넌트) */}
      <CategoryMenu />
    </main>
  );
};

export default Home;
