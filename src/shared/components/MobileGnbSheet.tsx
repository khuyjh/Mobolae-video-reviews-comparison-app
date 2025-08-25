'use client';

import Link from 'next/link';

import { MenuIcon } from 'lucide-react';

import BottomSheet from '@/shared/components/MobileBottomSheet';
import { SheetClose } from '@/shared/components/ui/sheet';

interface GnbSheetProps {
  /** 로그인 여부 (추후 실제 로직과 연결) */
  isLoggedIn: boolean;
}

/**
 * 모바일 전용 GNB 시트
 *
 * - 햄버거 버튼을 트리거로 바텀시트 열기
 * - 로그인 여부에 따라 메뉴 항목 분기
 *   - 로그인 상태: 비교하기, 마이페이지
 *   - 비로그인 상태: 로그인, 회원가입
 */
export default function MobileGnbSheet({ isLoggedIn }: GnbSheetProps) {
  // 로그인 여부에 따라 메뉴 항목을 분기
  const items = isLoggedIn
    ? [
        { href: '/compare', label: '비교하기' },
        { href: '/me', label: '마이페이지' },
      ]
    : [
        { href: '/login', label: '로그인' },
        { href: '/signup', label: '회원가입' },
      ];

  return (
    <div className='md:hidden'>
      <BottomSheet
        trigger={
          <button type='button' aria-label='메뉴 열기'>
            {/* 햄버거 아이콘 */}
            <MenuIcon className='transition-color size-5 text-gray-400 duration-200 hover:text-white' />
          </button>
        }
        side='bottom'
        className='rounded-t-lg'
        a11yTitle='GNB 메뉴'
        a11yDescription='메뉴 항목을 선택하세요.'
      >
        {/* 시트 내부 헤더 */}
        <div className='px-4'>
          <h3 className='text-base-semibold text-white'>메뉴</h3>
        </div>

        {/* 시트 내부 메뉴 리스트 */}
        <ul>
          {items.map((item) => (
            <li key={item.href}>
              {/* 메뉴 클릭 시 자동으로 시트 닫힘 */}
              <SheetClose asChild>
                <Link
                  href={item.href}
                  className='border-black-800 text-md-medium xl:text-base-medium hover:bg-black-800 mt-4 flex items-center rounded-lg border px-4 py-[15px] text-gray-600 hover:text-white'
                >
                  <span>{item.label}</span>
                </Link>
              </SheetClose>
            </li>
          ))}
        </ul>
      </BottomSheet>
    </div>
  );
}
