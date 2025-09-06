'use client';

import clsx from 'clsx';

import SortDropdown, { OrderOption } from '@/shared/components/SortDropdown';

/* 탭 값으로 쓸 문자 */
type TabKey = 'reviews' | 'items' | 'wishlist';

/*드롭다운 옵션 */
const profileTabOptions: OrderOption<TabKey>[] = [
  { label: '리뷰 남긴 상품', value: 'reviews' },
  { label: '등록한 상품', value: 'items' },
  { label: '찜한 상품', value: 'wishlist' },
];

type Props = {
  value: TabKey; // 현재 선택된 탭
  onChange: (val: TabKey) => void; // 탭 변경
};

export default function ProfileTabs({ value, onChange }: Props) {
  return (
    <div className='w-full'>
      {/* 모바일 드롭다운 */}
      <div className='md:hidden'>
        <SortDropdown<TabKey>
          options={profileTabOptions} // 배열전달
          value={value} // 현재 선택 값
          onChange={onChange} // 값 변경 시 전달
          placeholder='탭 선택'
          labelClassName='text-white text-left !text-lg-semibold' // 라벨 스타일 커스텀
          buttonClassName='!justify-between' // 버튼 내부 정렬 커스텀
          className='!w-[145px]'
        />
      </div>

      {/* pc 탭 버튼 */}
      <div className='hidden gap-6 md:flex'>
        {/*옵션 버튼 생성*/}
        {profileTabOptions.map((opt) => {
          const isActive = value === opt.value; //현재 탭과 동일한지 확인
          return (
            <button
              key={opt.value}
              onClick={() => onChange(opt.value)} // 클릭 시 클릭한 탭으로 변경
              className={clsx(
                'cursor-pointer pb-2 text-base transition',
                isActive
                  ? 'border-white font-semibold text-white'
                  : 'text-gray-400 hover:text-white',
              )}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
