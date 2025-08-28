// app/main/page.tsx (Server Component)
import CategoryMenu from '@/features/mainPage/components/CategoryMenu';
import FloatingButton from '@/features/mainPage/components/FloatingButton';
import MostReviewed from '@/features/mainPage/components/MostReviewed';
import {
  ReviewerRankingHorizontal,
  ReviewerRankingSidebar,
} from '@/features/mainPage/components/ReviewerRanking';
import TopShowcase from '@/features/mainPage/components/TopShowcase';
import { mockContents } from '@/features/mainPage/mock/contents';

const Home = () => {
  return (
    <main className='mx-auto w-full max-w-[1540px] px-5 py-6 md:px-[30px]'>
      <FloatingButton />

      {/* 모바일: 메인 위 가로형 랭킹 */}
      <div className='md:hidden'>
        <ReviewerRankingHorizontal />
      </div>

      {/* 레이아웃
          - md: [카테고리 | 메인 (랭킹)]
          - lg↑: [카테고리 | 메인 | 랭킹] */}
      <div className='flex'>
        {/* 좌측: 카테고리 메뉴 (md↑) */}
        <aside
          id='desktop-category-slot'
          className='hidden md:block'
          aria-label='카테고리 내비게이션'
        />

        {/* 가운데: 메인 콘텐츠 (남은 영역 전부) */}
        <section
          aria-labelledby='main-title'
          className='min-h-[60vh] min-w-0 flex-1 space-y-[60px]'
        >
          <h1 id='main-title' className='sr-only'>
            메인 콘텐츠
          </h1>

          {/* 태블릿(md) 전용: 메인 상단에 가로형 랭킹 */}
          <div className='hidden md:block lg:hidden'>
            <ReviewerRankingHorizontal />
          </div>

          <TopShowcase items={mockContents} />
          <MostReviewed items={mockContents} />
        </section>

        {/* 우측: 랭킹 사이드바 (lg↑) */}
        <div className='sticky hidden flex-none lg:block'>
          <ReviewerRankingSidebar />
        </div>
      </div>

      {/* 카테고리 메뉴는 한 번만 선언 */}
      <CategoryMenu />
    </main>
  );
};

export default Home;
