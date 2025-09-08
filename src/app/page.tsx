export const revalidate = 300; // 5분마다 캐시 재생성

import CategoryMenu from '@/features/mainPage/components/CategoryMenu';
import FilterSwitch from '@/features/mainPage/components/FilterSwitch';
import FloatingButton from '@/features/mainPage/components/FloatingButton';
import MostReviewed from '@/features/mainPage/components/MostReviewed';
import {
  ReviewerRankingHorizontal,
  ReviewerRankingSidebar,
} from '@/features/mainPage/components/ReviewerRanking';
import TopShowcase from '@/features/mainPage/components/TopShowcase';
import { BASE_URL, PATH_OPTION } from '@/shared/constants/constants';
import { ContentItem } from '@/shared/types/content';
import { toContentItem } from '@/shared/utils/mapApiToItem';
import { sortByRatingDescending, sortByReviewCountDescending } from '@/shared/utils/productSorters';

async function fetchTop6ByRating(): Promise<ContentItem[]> {
  const res = await fetch(
    `${BASE_URL?.replace(/\/$/, '')}/${PATH_OPTION.path.teamId}/products?order=rating`,
    { next: { revalidate: 300 } },
  );
  const data = await res.json();
  return (data.list ?? []).sort(sortByRatingDescending).slice(0, 6).map(toContentItem);
}

async function fetchTop6ByReviewCount(): Promise<ContentItem[]> {
  const res = await fetch(
    `${BASE_URL?.replace(/\/$/, '')}/${PATH_OPTION.path.teamId}/products?order=reviewCount`,
    { next: { revalidate: 300 } },
  );
  const data = await res.json();
  return (data.list ?? []).sort(sortByReviewCountDescending).slice(0, 6).map(toContentItem);
}

const Home = async () => {
  const [top6ByRating, top6ByReview] = await Promise.all([
    fetchTop6ByRating(),
    fetchTop6ByReviewCount(),
  ]);

  return (
    <main className='mx-auto w-full max-w-[1540px]'>
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
            <FilterSwitch>
              <>
                <TopShowcase items={top6ByRating} />
                <MostReviewed items={top6ByReview} />
              </>
            </FilterSwitch>
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
