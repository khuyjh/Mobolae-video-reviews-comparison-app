export const revalidate = 300; // 5분마다 캐시 재생성 (ISR)

import CategorySidebar from '@/features/mainPage/components/CategorySidebar';
import FilterSwitch from '@/features/mainPage/components/FilterSwitch';
import FloatingButton from '@/features/mainPage/components/FloatingButton';
import { HomeQueryGuard } from '@/features/mainPage/components/HomeQueryGuard';
import MostReviewed from '@/features/mainPage/components/MostReviewed';
import {
  ReviewerRankingHorizontal,
  ReviewerRankingSidebar,
} from '@/features/mainPage/components/ReviewerRanking';
import TopRated from '@/features/mainPage/components/TopRated';
import { normalizeOrRedirectOnServer } from '@/features/mainPage/services/queryNorm';
import { ContentItem } from '@/shared/types/content';
import { toContentItem } from '@/shared/utils/mapApiToItem';
import { sortByRatingDescending, sortByReviewCountDescending } from '@/shared/utils/productSorters';

// 별점 높은 순 Top6 데이터 조회
async function fetchTop6ByRating(): Promise<ContentItem[]> {
  const res = await fetch(`https://mogazoa-api.vercel.app/16-7/products?order=rating`, {
    next: { revalidate: 300 },
    cache: 'force-cache',
  });
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
  const res = await fetch(`https://mogazoa-api.vercel.app/16-7/products?order=reviewCount`);
  if (!res.ok) {
    throw new Error(`[fetchTop6ByReviewCount] HTTP ${res.status} ${res.statusText}`);
  }
  const data = await res.json();
  return (data.list ?? [])
    .sort(sortByReviewCountDescending) // 리뷰 수 내림차순
    .slice(0, 6)
    .map(toContentItem);
}

//TODO: error, 빈 데이터 처리
const Home = async ({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) => {
  // 1. Promise 풀어내기
  const params = (await searchParams) ?? {};

  // 2. 서버 단계 정규화
  normalizeOrRedirectOnServer(params, '/');

  // 3. 병렬 조회
  const [top6ByRating, top6ByReview] = await Promise.all([
    fetchTop6ByRating(),
    fetchTop6ByReviewCount(),
  ]);

  return (
    <main className='mx-auto w-full max-w-[1540px]'>
      {/* 클라이언트 단계 정규화 + 쿼리 가드 */}
      <HomeQueryGuard>
        {/* 콘텐츠 등록 플로팅 버튼 */}
        <FloatingButton />

        <div className='flex'>
          {/* 좌측: 카테고리 메뉴 (데스크탑 전용) */}
          <div className='hidden md:block'>
            <CategorySidebar />
          </div>

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
                  <MostReviewed items={top6ByReview} />
                  <TopRated items={top6ByRating} />
                </>
              </FilterSwitch>
            </div>
          </section>

          {/* 우측: 랭킹 사이드바 (데스크탑 전용) */}
          <div className='hidden flex-none md:max-w-[250px] md:min-w-[250px] lg:block'>
            <ReviewerRankingSidebar />
          </div>
        </div>
      </HomeQueryGuard>
    </main>
  );
};

export default Home;
