'use client';

import Link from 'next/link';

import { MenuIcon } from 'lucide-react';

import ArrowList from '@/features/mainPage/components/ArrowList';
import MobileBottomSheet from '@/shared/components/MobileBottomSheet';
import { SheetClose } from '@/shared/components/ui/sheet';

interface GnbSheetProps {
  /** 로그인 여부 (추후 실제 로직과 연결) */
  isLoggedIn: boolean;
}

const LINK_STYLE =
  'border-black-800 text-md-medium xl:text-base-medium hover:bg-black-800 flex items-center rounded-lg border px-4 py-[15px] text-gray-600 hover:text-white mb-4';

/**
 * 모바일 전용 GNB 시트
 *
 * - 햄버거 버튼을 트리거로 바텀시트 열기
 * - 로그인 여부에 따라 메뉴 항목 분기
 *   - 로그인 상태: 비교하기, 마이페이지
 *   - 비로그인 상태: 로그인, 회원가입
 */
const MobileGnbSheet = ({ isLoggedIn }: GnbSheetProps) => {
  // 로그인 여부에 따라 메뉴 항목을 분기
  const items = isLoggedIn
    ? [
        { href: '/compare', label: '비교하기' },
        { href: '/mypage', label: '마이페이지' },
      ]
    : [
        { href: '/signin', label: '로그인' },
        { href: '/signup', label: '회원가입' },
      ];

  return (
    <MobileBottomSheet
      trigger={
        <button type='button' aria-label='메뉴 열기' className='cursor-pointer'>
          <MenuIcon className='transition-color size-6 text-gray-400 duration-200 hover:text-white' />
        </button>
      }
      title='메뉴'
    >
      <ArrowList>
        {items.map((item) => (
          <SheetClose asChild key={item.href}>
            <Link href={item.href} className={`nav-item ${LINK_STYLE}`}>
              <span>{item.label}</span>
            </Link>
          </SheetClose>
        ))}
      </ArrowList>
    </MobileBottomSheet>
  );
};

export default MobileGnbSheet;
