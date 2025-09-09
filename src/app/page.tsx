export const revalidate = 300; // 5분마다 캐시 재생성 (ISR)

import CategoryMenu from '@/features/mainPage/components/CategoryMenu';
import FilterSwitch from '@/features/mainPage/components/FilterSwitch';
import FloatingButton from '@/features/mainPage/components/FloatingButton';
import MostReviewed from '@/features/mainPage/components/MostReviewed';
import {
  ReviewerRankingHorizontal,
  ReviewerRankingSidebar,
} from '@/features/mainPage/components/ReviewerRanking';
import TopShowcase from '@/features/mainPage/components/TopShowcase';
import { BASE_URL, TEAM_ID } from '@/shared/constants/constants';
import { ContentItem } from '@/shared/types/content';
import { toContentItem } from '@/shared/utils/mapApiToItem';
import { sortByRatingDescending, sortByReviewCountDescending } from '@/shared/utils/productSorters';

// BASE_URL 끝의 슬래시(/) 제거 → 안전한 base URL
const base = (BASE_URL ?? '').replace(/\/$/, '');

// 별점 높은 순 Top6 데이터 조회
async function fetchTop6ByRating(): Promise<ContentItem[]> {
  const res = await fetch(`${base}/${TEAM_ID}/products?order=rating`);
  if (!res.ok) {
    throw new Error(`[fetchTop6ByRating] HTTP ${res.status} ${res.statusText}`);
  }
  const data = await res.json();
  return (data.list ?? [])
    .sort(sortByRatingDescending) // 별점 내림차순
    .slice(0, 6) // 상위 6개만
    .map(toContentItem); // API 응답 → ContentItem 변환
}

// 리뷰 많은 순 Top6 데이터 조회
async function fetchTop6ByReviewCount(): Promise<ContentItem[]> {
  const res = await fetch(`${base}/${TEAM_ID}/products?order=reviewCount`);
  if (!res.ok) {
    throw new Error(`[fetchTop6ByReviewCount] HTTP ${res.status} ${res.statusText}`);
  }
  const data = await res.json();
  return (data.list ?? [])
    .sort(sortByReviewCountDescending) // 리뷰 수 내림차순
    .slice(0, 6)
    .map(toContentItem);
}

const Home = async () => {
  // 두 API를 병렬 호출 → 성능 최적화
  const [top6ByRating, top6ByReview] = await Promise.all([
    fetchTop6ByRating(),
    fetchTop6ByReviewCount(),
  ]);

  return (
    <main className='mx-auto w-full max-w-[1540px]'>
      {/* 콘텐츠 등록 플로팅 버튼 */}
      <FloatingButton />

      <div className='flex'>
        {/* 좌측: 카테고리 메뉴 (데스크탑 전용) */}
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

          {/* 모바일/태블릿: 상단 가로형 랭킹 */}
          <div className='mb-[60px] pl-5 md:pl-[30px] lg:hidden'>
            <ReviewerRankingHorizontal />
          </div>

          {/* Top6(별점순) + 리뷰 많은 순 */}
          <div className='px-5 md:px-[30px] xl:px-[60px]'>
            <FilterSwitch>
              <>
                <TopShowcase items={top6ByRating} />
                <MostReviewed items={top6ByReview} />
              </>
            </FilterSwitch>
          </div>
        </section>

        {/* 우측: 랭킹 사이드바 (데스크탑 전용) */}
        <div className='border-black-800 hidden flex-none border-l lg:block'>
          <ReviewerRankingSidebar />
        </div>
      </div>

      {/* 전역 카테고리 메뉴 (클라이언트 전용 컴포넌트) */}
      <CategoryMenu />
    </main>
  );
};

export default Home;
