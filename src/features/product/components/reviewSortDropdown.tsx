'use client';

import SortDropdown, { OrderOption } from '@/shared/components/SortDropdown';

const DROPDOWN_OPTIONS: OrderOption[] = [
  { label: '최신순', value: 'latest' },
  { label: '별점 높은순', value: 'rating_desc' },
  { label: '별점 낮은순', value: 'rating_asc' },
  { label: '좋아요순', value: 'likes' },
];

const ReviewSortDropdown = () => {
  const handleSortChange = (value: string) => {
    console.log('정렬 기준이 변경되었습니다:', value);
    // TODO: API 연결
  };

  return (
    <SortDropdown
      options={DROPDOWN_OPTIONS}
      value='latest'
      onChange={handleSortChange}
      placeholder='정렬'
    />
  );
};

export default ReviewSortDropdown;
