'use client';

import clsx from 'clsx';
import { useState } from 'react';

import RedirectModal from '@/features/auth/components/RedirectModal';
import FollowModal from '@/features/mypage/components/ProfileModal/FollowModal';
import Button from '@/shared/components/Button';
import SafeProfileImage from '@/shared/components/SafeProfileImage';

// 프로필 카드 컴포넌트 prop 타입 정의
export type ProfileCardProps = {
  userId: number;
  isLoggedIn?: boolean;
  name: string;
  avatarSrc?: string;
  bio?: string;
  followers?: number;
  following?: number;
  isMe?: boolean; // 내 프로필 여부
  isFollowing?: boolean; // 팔로잉 상태

  actionDisabled?: boolean; // 버튼 로딩/비활성 상태

  onEdit?: () => void;
  onLogout?: () => void;
  onFollowToggle?: () => void; // 팔로우/언팔로우 토글 핸들러
};

// 프로필 카드 UI
export default function ProfileCard({
  userId,
  name,
  isLoggedIn = false,
  avatarSrc = '',
  bio,
  followers = 0,
  following = 0,
  isMe = true,
  isFollowing = false,
  actionDisabled = false,
  onFollowToggle,
  onEdit,
  onLogout,
}: ProfileCardProps) {
  // 팔로워/팔로잉 모달 상태
  const [isFollowModalOpen, setIsFollowModalOpen] = useState(false);
  const [followModalType, setFollowModalType] = useState<'followers' | 'following' | null>(null);
  const hasFollowers = followers > 0;
  const hasFollowing = following > 0;

  // 로그인 리다이렉트 모달 상태
  const [isRedirectOpen, setIsRedirectOpen] = useState(false);

  // 팔로워/팔로잉 모달 열기
  const openModal = (type: 'followers' | 'following') => {
    if ((type === 'followers' && followers === 0) || (type === 'following' && following === 0))
      return;
    setFollowModalType(type);
    setIsFollowModalOpen(true);
  };

  // 키보드 접근성: Enter/Space로 모달 열기
  const onKeyOpen: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      const target = (e.currentTarget.dataset.type as 'followers' | 'following')!;
      openModal(target);
    }
  };

  // 팔로우 버튼 클릭 시 처리
  const handleFollowClick = () => {
    if (!isLoggedIn) {
      // 로그인 안 되어 있으면 리다이렉트 모달
      setIsRedirectOpen(true);
      return;
    }
    onFollowToggle?.();
  };

  return (
    <div className={CARD_CONTAINER}>
      {/* 프로필 이미지 */}
      <SafeProfileImage
        wrapperClassName={IMG_WRAPPER}
        imgClassName={IMG_STYLE}
        src={avatarSrc}
        alt={name}
        fill
        sizes='(min-width:1280px) 180px, 120px'
        priority
        quality={80}
      />

      {/* 닉네임 / 소개글 */}
      <div className={PROFILE_TEXT_WRAPPER}>
        <h3 className='text-xl-semibold text-white'>{name || '-'}</h3>
        <p className='text-md-regular mt-[10px] text-left text-gray-600'>{bio}</p>
      </div>

      {/* 팔로워/팔로잉 숫자 + 클릭 영역 */}
      <div className={FOLLOW_INFO_WRAPPER}>
        {/* 팔로워 */}
        <div
          className={clsx(FOLLOW_BOX, FOLLOW_BOX_LEFT)}
          role='button'
          tabIndex={0}
          data-type='followers'
          onClick={() => openModal('followers')}
          onKeyDown={onKeyOpen}
          aria-label='팔로워 보기'
        >
          <strong
            className={clsx(FOLLOW_COUNT, hasFollowers ? 'cursor-pointer' : 'cursor-default')}
          >
            {followers}
          </strong>
          <span className={clsx(FOLLOW_LABEL, hasFollowers ? 'cursor-pointer' : 'cursor-default')}>
            팔로워
          </span>
        </div>

        {/* 팔로잉 */}
        <div
          className={FOLLOW_BOX}
          role='button'
          tabIndex={0}
          data-type='following'
          onClick={() => openModal('following')}
          onKeyDown={onKeyOpen}
          aria-label='팔로잉 보기'
        >
          <strong
            className={clsx(FOLLOW_COUNT, hasFollowing ? 'cursor-pointer' : 'cursor-default')}
          >
            {following}
          </strong>
          <span className={clsx(FOLLOW_LABEL, hasFollowing ? 'cursor-pointer' : 'cursor-default')}>
            팔로잉
          </span>
        </div>
      </div>

      {/* 버튼 그룹: 내 프로필이면 편집/로그아웃, 아니면 팔로우 */}
      <div className={BUTTON_GROUP}>
        {isMe ? (
          <>
            <Button onClick={onEdit} variant='primary' className={clsx(BUTTON_BASE, BTN_EDIT)}>
              편집하기
            </Button>
            <Button onClick={onLogout} variant='tertiary' className={clsx(BUTTON_BASE, BTN_LOGOUT)}>
              로그아웃
            </Button>
          </>
        ) : (
          <Button
            onClick={handleFollowClick}
            disabled={actionDisabled}
            aria-busy={actionDisabled || undefined}
            aria-label={`${name ?? '-'}을(를) ${isFollowing ? '언팔로우' : '팔로우'}하기`}
            variant={isFollowing ? 'tertiary' : 'primary'}
            className={clsx(
              'block !w-full max-w-none', // 100% 폭
              'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-60',
              'disabled:hover:!border-gray-700 disabled:hover:!bg-transparent disabled:hover:!text-gray-500 disabled:hover:!brightness-100',
            )}
          >
            {isFollowing ? '팔로우 취소' : '팔로우'}
          </Button>
        )}
      </div>

      {/* 팔로워/팔로잉 모달 */}
      {isFollowModalOpen && followModalType && (
        <FollowModal
          userId={userId}
          type={followModalType}
          nickname={name}
          isOpen={isFollowModalOpen}
          onClose={() => setIsFollowModalOpen(false)}
        />
      )}

      {/* 로그인 유도 모달 */}
      <RedirectModal isOpen={isRedirectOpen} onClose={() => setIsRedirectOpen(false)} />
    </div>
  );
}

/* 스타일 상수 모음 */
const IMG_WRAPPER =
  'mx-auto h-[120px] w-[120px] xl:w-[180px] xl:h-[180px] overflow-hidden rounded-full';
const IMG_STYLE = 'h-full w-full object-cover';

const CARD_CONTAINER =
  'bg-black-800 border border-black-700 w-full md:w-[509px] mx-auto xl:w-[340px] rounded-[12px] px-[30px] py-[20px] md:py-[30px] xl:py-[20px] xl:pt-[40px] xl:pb-[30px]';

const PROFILE_TEXT_WRAPPER = 'mt-[30px] flex flex-col items-center gap-[10px] text-center';

const FOLLOW_INFO_WRAPPER = 'mt-[30px] flex justify-between text-center';
const FOLLOW_BOX_LEFT = ' border-r border-r-black-700';
const FOLLOW_BOX = 'group w-[50%] inline-flex flex-col items-center text-center ';
const FOLLOW_COUNT = 'text-base-semibold  text-white group-hover:!text-main transition-colors ';
const FOLLOW_LABEL = 'text-md-regular  text-gray-400 ';

const BUTTON_GROUP = 'mt-[30px] flex flex-col gap-[10px]';
const BUTTON_BASE = 'text-base-semibold w-full rounded-[8px] py-[15px] transition cursor-pointer';
const BTN_EDIT = 'bg-main text-black-800 hover:opacity-90';
const BTN_LOGOUT = 'border border-black-700 text-gray-400 hover:bg-black-700';
