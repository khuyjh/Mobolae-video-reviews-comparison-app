'use client';

import Dropdown from '@/shared/components/Dropdown';

const DROPDOWN_OPTIONS = [
  { name: '최신순', value: 'latest' },
  { name: '별점 높은순', value: 'rating_desc' },
  { name: '별점 낮은순', value: 'rating_asc' },
  { name: '좋아요순', value: 'likes' },
];

const ReviewSortDropdown = () => {
  const handleSortChange = (value: string | number | boolean) => {
    console.log('정렬 기준이 변경되었습니다:', value);
    // TODO: API 연결
  };

  return <Dropdown options={DROPDOWN_OPTIONS} onChange={handleSortChange} placeholder='정렬' />;
};

export default ReviewSortDropdown;
