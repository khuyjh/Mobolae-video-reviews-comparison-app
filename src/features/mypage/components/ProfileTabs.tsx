'use client';

import dynamic from 'next/dynamic';

import React, { memo, useEffect, useMemo, useState } from 'react';

import type { OrderOption } from '@/shared/components/SortDropdown';

type TabKey = 'reviews' | 'items' | 'wishlist';

const profileTabOptions: OrderOption<TabKey>[] = [
  { label: '리뷰 남긴 콘텐츠', value: 'reviews' },
  { label: '등록한 콘텐츠', value: 'items' },
  { label: '찜한 콘텐츠', value: 'wishlist' },
];

// dynamic으로 불러오기
const MobileDropdown = dynamic(() => import('@/shared/components/SortDropdown'), {
  ssr: false,
  loading: () => null,
});

function toStringOptions(opts: OrderOption<TabKey>[]): OrderOption<string>[] {
  return opts.map((o) => ({ label: o.label, value: o.value }));
}

function isTabKey(v: string): v is TabKey {
  return v === 'reviews' || v === 'items' || v === 'wishlist';
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia('(max-width: 767px)');
    const update = () => setIsMobile(mql.matches);
    update();
    mql.addEventListener?.('change', update);
    return () => mql.removeEventListener?.('change', update);
  }, []);
  return isMobile;
}

type Props = { value: TabKey; onChange: (val: TabKey) => void };

function ProfileTabs({ value, onChange }: Props) {
  const isMobile = useIsMobile();

  // readonly 이슈 방지 + 타입 맞춤
  const dropdownOptions = useMemo(() => toStringOptions(profileTabOptions), []);

  return (
    <div className='w-full'>
      {isMobile && (
        <div className='md:hidden'>
          <MobileDropdown
            options={dropdownOptions}
            value={value}
            onChange={(v: string) => {
              if (isTabKey(v)) onChange(v);
            }}
            placeholder='탭 선택'
            labelClassName='text-white text-left !text-lg-semibold'
            buttonClassName='!justify-between'
            className='!w-[145px]'
          />
        </div>
      )}

      <div className='hidden gap-6 md:flex'>
        {profileTabOptions.map((opt) => {
          const isActive = value === opt.value;
          return (
            <button
              key={opt.value}
              type='button'
              onClick={() => onChange(opt.value)}
              className={`cursor-pointer pb-2 text-base transition ${
                isActive
                  ? 'border-white font-semibold text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default memo(ProfileTabs);
