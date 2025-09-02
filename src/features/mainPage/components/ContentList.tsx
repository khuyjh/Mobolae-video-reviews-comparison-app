'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { useInfiniteQuery } from '@tanstack/react-query';
import React, { useMemo, useCallback } from 'react';

import SortDropdown from '@/shared/components/SortDropdown';
import { CATEGORIES } from '@/shared/constants/constants';
import { PRODUCT_ORDER_OPTIONS, type ProductOrderKey } from '@/shared/types/SortDropdownTypes';
import { toContentItem } from '@/shared/utils/mapApiToItem';
import { readQuery } from '@/shared/utils/query';

import VirtualizedContentGrid from './VirtualizedContentGrid';
import { serverListContents } from '../mock/mockContents'; // ★ 방금 추가한 함수 import

const PAGE_SIZE = 24;

/**
 * 콘텐츠 리스트 컴포넌트
 * 쿼리 파싱 → (서버 가짜 API) 필터/정렬/커서 → 카드 변환 → 가상화 + 무한스크롤
 */
const ContentList = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // 쿼리 파싱: 기본값 { category:null, keyword:'', order:'recent' }
  const { category, keyword, order } = useMemo(() => readQuery(searchParams), [searchParams]);

  // 상단 타이틀
  const title = useMemo(() => {
    if (keyword && keyword.trim()) return `‘${keyword}’로 검색한 콘텐츠`;
    if (category !== null) {
      const found = CATEGORIES.find((c) => Number(c.id) === category);
      return found ? `${found.name}의 모든 콘텐츠` : `카테고리 ${category}의 모든 콘텐츠`;
    }
    return null;
  }, [keyword, category]);

  // 무한스크롤 쿼리
  const { data, isFetchingNextPage, fetchNextPage, hasNextPage, status, refetch } =
    useInfiniteQuery({
      queryKey: ['contents', { category, keyword, order }],
      initialPageParam: 0 as number, // cursor
      queryFn: ({ pageParam }) => {
        const res = serverListContents({
          category,
          keyword,
          order,
          cursor: pageParam ?? 0,
          limit: PAGE_SIZE,
        });
        return Promise.resolve(res); // 비동기 시뮬 (실제 API로 교체 시 fetch로 대체)
      },
      getNextPageParam: (lastPage) => {
        // nextCursor가 null이면 더 없음
        return lastPage.nextCursor ?? undefined;
      },
    });

  // 플랫 아이템 (UI 변환)
  const items = useMemo(() => {
    const pages = data?.pages ?? [];
    return pages.flatMap((p) => p.list.map(toContentItem));
  }, [data]);

  // 정렬 변경 시: cursor 제거 + URL 갱신 (뒤로가기 스크롤 보존)
  const handleChangeOrder = useCallback(
    (nextOrder: ProductOrderKey) => {
      const next = new URLSearchParams(searchParams);
      next.set('order', nextOrder);
      next.delete('cursor'); // 커서 초기화
      router.replace(`${pathname}?${next.toString()}`, { scroll: false });
      // 쿼리키가 바뀌니 자동 리패치
      // (만약 강제 리패치가 필요하면 refetch() 호출 가능)
    },
    [searchParams, router, pathname],
  );

  return (
    <section className='mx-auto w-full'>
      <div className='mb-[15px] flex w-full flex-col justify-between space-y-[30px] md:mb-[30px] md:flex-row md:space-y-0'>
        {title && <h2 className='text-xl-semibold text-white'>{title}</h2>}
        <div className='flex w-full items-center justify-between md:w-fit'>
          <div id='mobile-category-slot' className='md:hidden' />
          <SortDropdown
            options={PRODUCT_ORDER_OPTIONS}
            value={order}
            onChange={handleChangeOrder}
          />
        </div>
      </div>

      {/* 가상화 + 무한스크롤 */}
      <VirtualizedContentGrid
        items={items}
        hasNextPage={!!hasNextPage}
        fetchNextPage={fetchNextPage}
        isLoading={isFetchingNextPage || status === 'pending'}
        itemHeightEstimate={276}
      />
    </section>
  );
};

export default ContentList;
