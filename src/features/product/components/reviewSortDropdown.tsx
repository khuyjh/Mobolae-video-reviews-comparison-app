'use client';

import Dropdown from '@/shared/components/Dropdown';

const DROPDOWN_OPTIONS = [
  { name: '최신순', value: 'latest' },
  { name: '별점 높은순', value: 'rating_desc' },
  { name: '별점 낮은순', value: 'rating_asc' },
  { name: '좋아요순', value: 'likes' },
];

const ReviewSortDropdown = ({ className }: { className?: string }) => {
  const handleSortChange = (value: string | number | boolean) => {
    console.log('정렬 기준이 변경되었습니다:', value);
    // TODO: API 연결
  };

  return (
    <Dropdown
      className='max-w-[120px]' // 가로폭 줄임
      triggerClassName='px-2 py-1 text-xs' // 버튼 높이 + 폰트 줄임
      options={DROPDOWN_OPTIONS}
      onChange={handleSortChange}
      placeholder='정렬'
    />
  );
};

export default ReviewSortDropdown;
