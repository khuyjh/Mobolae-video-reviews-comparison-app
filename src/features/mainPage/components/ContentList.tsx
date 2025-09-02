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
import { serverListContents } from '../mock/mockContents';

const PAGE_SIZE = 24;

/**
 * ContentList
 * - URL 쿼리(category/keyword/order)를 단일 소스로 사용
 * - useInfiniteQuery로 커서 기반 페이지네이션
 * - 응답을 UI 모델로 변환 후 VirtualizedContentGrid로 가상화 렌더
 */
const ContentList = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  /** URL → 안전 파싱 (기본값: { category:null, keyword:'', order:'recent' }) */
  const { category, keyword, order } = useMemo(() => readQuery(searchParams), [searchParams]);

  /** 상단 타이틀 (검색어/카테고리 상황에 따라 가변) */
  const title = useMemo(() => {
    if (keyword && keyword.trim()) return `‘${keyword}’로 검색한 콘텐츠`;
    if (category !== null) {
      const found = CATEGORIES.find((c) => Number(c.id) === category);
      return found ? `${found.name}의 모든 콘텐츠` : `카테고리 ${category}의 모든 콘텐츠`;
    }
    return null;
  }, [keyword, category]);

  /** 무한 스크롤 쿼리 (커서 기반) */
  const { data, isFetchingNextPage, fetchNextPage, hasNextPage, status, refetch } =
    useInfiniteQuery({
      queryKey: ['contents', { category, keyword, order }], // 조건별 캐시 키
      initialPageParam: 0 as number, // 첫 커서
      queryFn: ({ pageParam }) =>
        serverListContents({
          category,
          keyword,
          order,
          cursor: pageParam ?? 0,
          limit: PAGE_SIZE,
        }),
      getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined, // 다음 커서 없으면 종료
    });

  /** pages → 단일 배열로 평탄화 + UI 전용 모델 매핑 */
  const items = useMemo(() => {
    const pages = data?.pages ?? [];
    return pages.flatMap((p) => p.list.map(toContentItem));
  }, [data]);

  /**
   * 정렬 변경
   * - URL에만 반영 (cursor 초기화)
   * - queryKey 갱신으로 자동 리패치
   * - scroll:false로 뒤로가기 시 스크롤 보존
   */
  const handleChangeOrder = useCallback(
    (nextOrder: ProductOrderKey) => {
      const next = new URLSearchParams(searchParams);
      next.set('order', nextOrder);
      next.delete('cursor'); // 커서 초기화
      router.replace(`${pathname}?${next.toString()}`, { scroll: false });
      // 필요 시 강제 refetch 가능: refetch();
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

      {/* 가상화 + 무한스크롤 (행 단위) */}
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
