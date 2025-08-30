import CategoryMenu from '@/features/mainPage/components/CategoryMenu';
import FloatingButton from '@/features/mainPage/components/FloatingButton';
import MostReviewed from '@/features/mainPage/components/MostReviewed';
import {
  ReviewerRankingHorizontal,
  ReviewerRankingSidebar,
} from '@/features/mainPage/components/ReviewerRanking';
import TopShowcase from '@/features/mainPage/components/TopShowcase';
import { mockContents } from '@/features/mainPage/mock/contents';

/**
 * Home 페이지 컴포넌트
 *
 * - 메인 레이아웃을 담당하는 서버 컴포넌트
 * - 반응형 레이아웃에 따라 카테고리 메뉴와 리뷰어 랭킹 위치가 달라짐
 *   - **모바일 (md 미만)**: 메인 상단에 가로형 랭킹
 *   - **태블릿 (md 이상 lg 미만)**: 메인 콘텐츠 내부 상단에 가로형 랭킹
 *   - **데스크탑 (lg 이상)**: 우측에 세로형 사이드바 랭킹
 * - 주요 섹션
 *   - FloatingButton: 플로팅 액션 버튼
 *   - ReviewerRankingHorizontal / Sidebar: 반응형 랭킹 영역
 *   - TopShowcase: Top 6 콘텐츠
 *   - MostReviewed: 리뷰 많은 상품
 *   - CategoryMenu: 카테고리 내비게이션
 *
 * @component
 * @example
 * ```tsx
 * <Home />
 * ```
 *
 */
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

        {/* 가운데: 메인 콘텐츠 */}
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

      {/* 카테고리 메뉴는 전역으로 한 번만 선언 */}
      <CategoryMenu />
    </main>
  );
};

export default Home;
