'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import React, { useMemo, useCallback } from 'react';

import MobileCategorySheet from '@/features/mainPage/components/MobileCategorySheet';
import SortDropdown from '@/shared/components/SortDropdown';
import { CATEGORIES, TEAM_ID } from '@/shared/constants/constants';
import { ContentApi } from '@/shared/types/content';
import { PRODUCT_ORDER_OPTIONS, type ProductOrderKey } from '@/shared/types/SortDropdownTypes';
import { toContentItem } from '@/shared/utils/mapApiToItem';
import { readQuery } from '@/shared/utils/query';

import VirtualizedContentGrid from './VirtualizedContentGrid';
import { useInfiniteApi } from '../../../../openapi/queries/infiniteQueries';

const PAGE_SIZE = 24;

/**
 * ContentList
 *
 * - URL 쿼리(category/keyword/order)를 단일 소스로 사용
 * - useInfiniteApi(cursor)로 무한스크롤 CSR 목록 렌더
 * - 모바일에서는 카테고리 시트를 정렬 드롭다운 옆에 표시
 */
const ContentList = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  /** URL → 필터값 파싱 */
  const { category, keyword, order } = useMemo(() => readQuery(searchParams), [searchParams]);

  /** 상단 타이틀 */
  const title = useMemo(() => {
    if (keyword && keyword.trim()) return `‘${keyword}’로 검색한 콘텐츠`;
    if (category !== null) {
      const found = CATEGORIES.find((c) => Number(c.id) === category);
      return found ? `${found.name}의 모든 콘텐츠` : `카테고리 ${category}의 모든 콘텐츠`;
    }
    return null;
  }, [keyword, category]);

  /** 무한스크롤 API */
  const normKeyword = (keyword ?? '').trim().toLowerCase();
  const normOrder: ProductOrderKey = order ?? 'recent';

  const { data, isFetchingNextPage, fetchNextPage, hasNextPage, isPending } = useInfiniteApi(
    ['contents', TEAM_ID!, category ?? 'all', normKeyword, normOrder, PAGE_SIZE],
    '/{teamId}/products',
    {
      path: { teamId: TEAM_ID! },
      query: {
        category: category ?? undefined,
        keyword: normKeyword || undefined,
        order: normOrder !== 'recent' ? normOrder : undefined,
        limit: PAGE_SIZE,
      },
    },
  );

  /** API → UI 모델 매핑 */
  const items = useMemo(
    () => ((data?.items ?? []) as ContentApi[]).map(toContentItem),
    [data?.items],
  );

  /** 정렬 변경 → URL만 갱신, cursor 초기화 */
  const handleChangeOrder = useCallback(
    (nextOrder: ProductOrderKey) => {
      if (nextOrder === order) return;

      const next = new URLSearchParams(searchParams);
      if (nextOrder === 'recent') next.delete('order');
      else next.set('order', nextOrder);

      next.delete('cursor');
      router.replace(`${pathname}?${next.toString()}`, { scroll: false });
    },
    [searchParams, router, pathname, order],
  );

  return (
    <section className='mx-auto mb-11 w-full'>
      <div className='mb-[15px] flex w-full flex-col justify-between space-y-[30px] md:mb-[30px] md:flex-row md:space-y-0'>
        {title && <h2 className='text-xl-semibold text-white'>{title}</h2>}
        <div className='flex w-full items-center justify-between md:w-fit'>
          <div className='md:hidden'>
            <MobileCategorySheet />
          </div>

          <SortDropdown
            options={PRODUCT_ORDER_OPTIONS}
            value={order}
            onChange={handleChangeOrder}
          />
        </div>
      </div>

      <VirtualizedContentGrid
        items={items}
        hasNextPage={!!hasNextPage}
        fetchNextPage={fetchNextPage}
        isLoading={isFetchingNextPage || isPending}
        itemHeightEstimate={276}
      />
    </section>
  );
};

export default ContentList;
