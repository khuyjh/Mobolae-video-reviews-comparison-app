'use client';

import { useEffect, useState } from 'react';

import Dropdown from '@/shared/components/Dropdown';
import HomeItemCard from '@/shared/components/HomeItemCard';

const mockItems = [
  {
    title: '다이슨 슈퍼소닉 블루',
    contentImage: '/images/testImage.png',
    reviewCount: 129,
    favoriteCount: 34,
    rating: 4.7,
    contentId: 1,
  },
  {
    title: '애플 워치 7',
    contentImage: '/images/testImage2.png',
    reviewCount: 88,
    favoriteCount: 22,
    rating: 4.3,
    contentId: 2,
  },
  {
    title: '헤라 블랙쿠션 긴 제목 처리 테스트용 의미없는 긴 이름',
    contentImage: '/images/testImage3.png',
    reviewCount: 200,
    favoriteCount: 50,
    rating: 4.9,
    contentId: 3,
  },
];

const CATEGORIES = [
  { name: 'category1', value: 1 },
  { name: 'category2', value: 2 },
  { name: 'category3', value: 3 },
  { name: 'category4', value: 4 },
];

const DropdownTestPage = () => {
  const initial = CATEGORIES[1]; // category2

  // (선택) 화면에도 현재 선택값을 보여주고 싶으면 상태를 둡니다.
  const [selected, setSelected] = useState<string | number | boolean>(initial.value);

  // 초기 렌더에서 initialValue가 제대로 반영됐는지 한 번만 찍기
  useEffect(() => {
    console.log('초기 option.name:', initial.name, '/ value:', initial.value);
  }, [initial.name, initial.value]);

  // 변경 시 option.name 콘솔 출력 (Dropdown은 수정하지 않음)
  const handleChange = (v: string | number | boolean) => {
    setSelected(v); // 상태가 필요 없으면 이 줄은 지워도 됩니다.
    const name = CATEGORIES.find((o) => String(o.value) === String(v))?.name ?? '(없음)';
    console.log('선택 option.name:', name, '/ value:', v);
  };

  return (
    <>
      <main className='space-y-3 p-6'>
        <Dropdown
          options={CATEGORIES}
          initialValue={initial}
          placeholder='카테고리 선택'
          onChange={handleChange}
        />

        {/* (선택) 화면에서도 현재 라벨을 확인하고 싶다면 */}
        <div className='text-sm text-gray-400'>
          현재 name: {CATEGORIES.find((o) => String(o.value) === String(selected))?.name ?? '-'}
        </div>
      </main>
      <div className='flex gap-[10px] md:gap-[15px] xl:gap-[20px]'>
        {mockItems.map((item, idx) => (
          <HomeItemCard key={idx} {...item} />
        ))}
      </div>
    </>
  );
};

export default DropdownTestPage;
