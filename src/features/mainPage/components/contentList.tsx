// src/features/mainPage/components/contentList.tsx
'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import React, { useMemo, useCallback } from 'react';

import SortDropdown from '@/shared/components/SortDropdown';
import { PRODUCT_ORDER_OPTIONS, ProductOrderKey } from '@/shared/types/SortDropdownTypes';
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

  /**
   * 1) URL 쿼리(category, keyword, order)를 읽어서
   *    내부에서 안전하게 사용할 값으로 변환
   *    - 기본값 포함: category(null), keyword(''), order('recent')
   */
  const { category, keyword, order } = useMemo(() => readQuery(searchParams), [searchParams]);

  /**
   * 2) 필터 → 정렬 → 아이템 매핑
   *    - URL이 단일 소스이므로 화면 상태는 쿼리만을 근거로 파생
   */
  const filtered = useMemo(
    () =>
      filterContents(mockContentApiResponse.list, {
        category,
        keyword,
      }),
    [category, keyword],
  );

  const sorted = useMemo(() => sortContents(filtered, order), [filtered, order]);

  const items = useMemo(() => sorted.map(toContentItem), [sorted]);

  /**
   * 3) 정렬 변경 시: URL만 갱신하여 뒤로가기/새로고침 복원 보장
   *    - ReadonlyURLSearchParams를 복제한 뒤 필요한 키만 변경
   *    - scroll 유지
   */
  const handleChangeOrder = useCallback(
    (nextOrder: ProductOrderKey) => {
      const next = new URLSearchParams(searchParams);
      next.set('order', nextOrder);
      next.delete('cursor'); // ← 페이지네이션 초기화
      router.push(`${pathname}?${next.toString()}`, { scroll: false });
    },
    [searchParams, router, pathname],
  );

  return (
    <main className='mx-auto w-full max-w-[1540px] px-5 md:px-[30px]'>
      <div className='mb-6 flex flex-wrap items-center justify-between gap-3'>
        <h2 className='text-xl-semibold text-white'>콘텐츠 리스트</h2>

        {/* 현재 적용된 필터·정렬 상태 요약 */}
        <div className='text-sm text-gray-400'>
          {keyword ? (
            <>
              검색어: <span className='text-white'>{keyword}</span>
            </>
          ) : (
            '검색어 없음'
          )}
          {category !== null ? (
            <>
              {' '}
              · 카테고리 ID: <span className='text-white'>{category}</span>
            </>
          ) : (
            ' · 전체 카테고리'
          )}
        </div>

        <SortDropdown options={PRODUCT_ORDER_OPTIONS} value={order} onChange={handleChangeOrder} />
      </div>

      <ContentGrid items={items} />
    </main>
  );
}
