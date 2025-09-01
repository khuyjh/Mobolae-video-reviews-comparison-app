// src/features/mainPage/components/contentList.tsx
'use client';

import React, { useMemo, useState } from 'react';

import SortDropdown from '@/shared/components/SortDropdown';
import { PRODUCT_ORDER_OPTIONS, ProductOrderKey } from '@/shared/types/SortDropdownTypes';
import { toContentItem } from '@/shared/utils/mapApiToItem';
import { sortContents } from '@/shared/utils/sortContents';

import ContentGrid from './ContentGrid';
import { mockContentApiResponse } from '../mock/mockContents';

export default function ContentList() {
  const [order, setOrder] = useState<ProductOrderKey>('recent');

  const sortedApi = useMemo(() => sortContents(mockContentApiResponse.list, order), [order]);
  const items = useMemo(() => sortedApi.map(toContentItem), [sortedApi]);

  return (
    <main className='mx-auto w-full max-w-[1540px] px-5 md:px-[30px]'>
      <div className='mb-6 flex items-center justify-between'>
        <h2 className='text-xl-semibold text-white'>콘텐츠 리스트</h2>
        <SortDropdown options={PRODUCT_ORDER_OPTIONS} value={order} onChange={setOrder} />
      </div>

      <ContentGrid items={items} />
    </main>
  );
}
