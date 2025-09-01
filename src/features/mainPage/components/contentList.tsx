// src/features/mainPage/components/contentList.tsx
'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import React, { useMemo, useCallback } from 'react';

import SortDropdown from '@/shared/components/SortDropdown';
import { CATEGORIES } from '@/shared/constants/constants';
import { PRODUCT_ORDER_OPTIONS, type ProductOrderKey } from '@/shared/types/SortDropdownTypes';
import { filterContents } from '@/shared/utils/fielterContents';
import { toContentItem } from '@/shared/utils/mapApiToItem';
import { readQuery } from '@/shared/utils/query';
import { sortContents } from '@/shared/utils/sortContents';

import ContentGrid from './ContentGrid';
import { mockContentApiResponse } from '../mock/mockContents';

export default function ContentList() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // 1) URL 쿼리(category, keyword, order) 읽기
  const { category, keyword, order } = useMemo(() => readQuery(searchParams), [searchParams]);

  // 2) 타이틀 결정
  const title = useMemo(() => {
    if (keyword && keyword.trim()) {
      return `‘${keyword}’로 검색한 콘텐츠`;
    }
    if (category !== null) {
      const found = CATEGORIES.find((c) => Number(c.id) === category);
      return found ? `${found.name}의 모든 콘텐츠` : `카테고리 ${category}의 모든 콘텐츠`;
    }
    return null; // 둘 다 없으면 리스트는 로드 안 됨
  }, [keyword, category]);

  // 3) 필터 → 정렬 → 카드 매핑
  const filtered = useMemo(
    () => filterContents(mockContentApiResponse.list, { category, keyword }),
    [category, keyword],
  );
  const sorted = useMemo(() => sortContents(filtered, order), [filtered, order]);
  const items = useMemo(() => sorted.map(toContentItem), [sorted]);

  // 4) 정렬 변경 → URL 갱신
  const handleChangeOrder = useCallback(
    (nextOrder: ProductOrderKey) => {
      const next = new URLSearchParams(searchParams);
      next.set('order', nextOrder);
      next.delete('cursor'); // 페이지네이션 초기화
      router.push(`${pathname}?${next.toString()}`, { scroll: false });
    },
    [searchParams, router, pathname],
  );

  return (
    <main className='mx-auto w-full'>
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

      <ContentGrid items={items} />
    </main>
  );
}
