'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

import clsx from 'clsx';
import { MenuIcon } from 'lucide-react';

import ArrowList from '@/features/mainPage/components/ArrowList';
import MobileBottomSheet from '@/shared/components/MobileBottomSheet';
import { SheetClose } from '@/shared/components/ui/sheet';

interface GnbSheetProps {
  isLoggedIn: boolean;
  isCompareReady: boolean;
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
 * - 비교할 컨텐츠가 두 개 준비되면 비교하기 버튼과 햄버거 버튼 ui 변화
 */
const MobileGnbSheet = ({ isLoggedIn, isCompareReady }: GnbSheetProps) => {
  const currentPath = usePathname();
  const params = useSearchParams();
  const redirectUrl = params.get('redirect_url') ? params.get('redirect_url') : currentPath;
  const query = `?redirect_url=${redirectUrl}`;

  // 로그인 여부에 따라 메뉴 항목을 분기
  const items = isLoggedIn
    ? [
        { href: '/compare', label: '비교하기' },
        { href: '/mypage', label: '마이페이지' },
      ]
    : [
        { href: `/signin${query}`, label: '로그인' },
        { href: `/signup${query}`, label: '회원가입' },
      ];

  return (
    <MobileBottomSheet
      trigger={
        <div className='relative h-6 w-6'>
          <button type='button' aria-label='메뉴 열기' className='cursor-pointer'>
            <MenuIcon className='transition-color size-6 text-gray-400 duration-200 hover:text-white' />
          </button>
          {isCompareReady && (
            <div className='absolute top-1 right-[3px] h-[10px] w-[10px] translate-x-[50%] translate-y-[-50%] overflow-hidden rounded-full'>
              <div className='bg-main h-full w-full object-cover' />
            </div>
          )}
        </div>
      }
      title='메뉴'
    >
      <ArrowList>
        {items.map((item) => (
          <SheetClose asChild key={item.href}>
            <Link
              href={item.href}
              className={clsx(`nav-item ${LINK_STYLE}`, {
                'text-main hover:text-main-dark animate-pulse':
                  item.label === '비교하기' && isCompareReady,
              })}
            >
              <span>{item.label}</span>
            </Link>
          </SheetClose>
        ))}
      </ArrowList>
    </MobileBottomSheet>
  );
};

export default MobileGnbSheet;
