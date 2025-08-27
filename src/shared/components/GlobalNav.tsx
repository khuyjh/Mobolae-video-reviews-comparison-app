'use client';
/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';

import { useEffect, useRef, useState } from 'react';

import { cn } from '@/shared/lib/cn';

export default function GlobalNav() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const triggerBtnRef = useRef<HTMLButtonElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);

  {
    /* 모바일 검색창 닫힘*/
  }
  useEffect(() => {
    if (!searchOpen) return;

    const onMouseDown = (e: MouseEvent) => {
      const t = e.target;
      if (!(t instanceof Node)) return;
      const inSearch = mobileSearchRef.current?.contains(t);
      const inTrigger = triggerBtnRef.current === t || triggerBtnRef.current?.contains(t);

      if (!inSearch && !inTrigger) setSearchOpen(false);
    };

    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, [searchOpen]);

  return (
    <header className='sticky top-0 z-40 border border-[var(--color-black-800)] bg-[var(--color-black-900)] py-[11px] pb-[11px] md:py-[15px] md:pb-[15px] xl:py-[22px] xl:pb-[22px]'>
      <nav className={NAV_CONTAINER}>
        {/*로고*/}
        <Link href='/' className='flex items-center'>
          <img src='/icons/Logo.svg' alt='로고' className='h-[28px] md:h-[46px] xl:h-[56]' />
        </Link>
        {/*PC 검색창*/}
        <div className='hidden md:flex md:items-center'>
          <div className={SEARCH_BOX}>
            <button type='button' className='cursor-pointer'>
              <img src='/icons/SearchIcon.svg' alt='검색' className='h-[24px] w-[24px]' />
            </button>
            <input
              type='text'
              placeholder='상품 이름을 검색해 보세요'
              className='ml-[12px] w-full bg-transparent outline-none'
            />
          </div>

          {/*PC 오른쪽 메뉴 / 로그인 상태 -> 비교하기, 내 프로필 / 로그아웃 상태 -> 로그인, 회원가입*/}
          {isLoggedIn ? (
            <div className={DESKTOP_MENU}>
              <Link href='/compare' className='hover:text-[var(--color-gray-600)]'>
                비교하기
              </Link>
              <Link href='/mypage' className='hover:text-[var(--color-gray-600)]'>
                내 프로필
              </Link>
            </div>
          ) : (
            <div className={DESKTOP_AUTH}>
              <Link href='/signin' className='hover:text-[var(--color-gray-600)]'>
                로그인
              </Link>
              <Link href='/signup' className='hover:text-[var(--color-gray-600)]'>
                회원가입
              </Link>
            </div>
          )}
        </div>

        {/*모바일 메뉴,검색 버튼*/}
        <div className='flex items-center md:hidden'>
          {!searchOpen && (
            <>
              <button
                ref={triggerBtnRef}
                className='grid h-[24px] w-[24px] place-items-center'
                onClick={() => setSearchOpen(true)}
                aria-label='검색 열기'
              >
                <img src='/icons/SearchIcon.svg' alt='검색' />
              </button>
              <button
                className='ml-[20px] grid h-[24px] w-[24px] place-items-center'
                aria-label='메뉴 열기'
              >
                <img src='/icons/MenuIcon.svg' alt='메뉴' />
              </button>
            </>
          )}
        </div>

        {/*모바일 검색창*/}
        <div className={cn('md:hidden', searchOpen ? 'static' : 'absolute')}>
          <div
            ref={mobileSearchRef}
            className={cn(
              MOBILE_SEARCH_BOX,
              'overflow-hidden md:hidden',
              'transition-[width] duration-300',
              searchOpen
                ? 'pointer-events-auto w-[calc(100%_-_60px)] ease-out'
                : 'pointer-events-none w-0 opacity-0 ease-in',
            )}
          >
            <button className='h-[24px] w-[24px] place-items-center' aria-label='검색'>
              <img src='/icons/SearchIcon.svg' alt='검색' />
            </button>
            <input
              type='text'
              placeholder='상품 이름을 검색해 보세요'
              className='ml-[15px] w-full rounded-md bg-transparent outline-none'
            />
          </div>
          {searchOpen && (
            <button
              className='ml-[20px] grid h-[24px] w-[24px] place-items-center'
              aria-label='메뉴 열기'
            >
              <img src='/icons/MenuIcon.svg' alt='메뉴' />
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}

const baseMenu =
  'flex items-center  xl:text-[16px] md:text-[14px] ml-[60px] whitespace-nowrap text-base text-white';

const NAV_CONTAINER =
  'relative mx-[20px] flex h-[70px] items-center justify-between md:mx-[60px]  xl:mx-[120px]';

const SEARCH_BOX =
  'flex w-[400px] xl:text-[16px] md:text-[14px] md:w-[300px] items-center rounded-[28px] bg-black-800 px-[20px] py-[16px] text-base text-white';

const MOBILE_SEARCH_BOX =
  'absolute top-[10px] right-[60px] left-[-8px] flex items-center rounded-[28px] bg-black-800 px-[15px] py-[12px] text-[14px] text-white';

const DESKTOP_MENU = cn(baseMenu, 'gap-[60px]');

const DESKTOP_AUTH = cn(baseMenu, 'gap-[40px]');
