// src/app/content-list/page.tsx
import { div } from 'framer-motion/client';
import React from 'react';

import ContentList from '@/features/mainPage/components/contentList';

/**
 * ContentList 테스트 페이지
 *
 * - 임시로 목데이터 기반 콘텐츠 리스트를 보여준다.
 * - Home 페이지와 분리해서 UI/동작을 독립적으로 검증할 수 있다.
 */
export default function ContentListPage() {
  return (
    <div className='max-w-[1540px] px-5 pt-[60px] md:px-[30px] xl:px-[60px]'>
      <ContentList />;
    </div>
  );
}
