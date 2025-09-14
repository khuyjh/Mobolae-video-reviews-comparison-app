'use client';

import clsx from 'clsx';
import { useState } from 'react';

import RedirectModal from '@/features/auth/components/RedirectModal';
import FollowModal from '@/features/mypage/components/ProfileModal/FollowModal';
import Button from '@/shared/components/Button';
import SafeProfileImage from '@/shared/components/SafeProfileImage';

export type ProfileCardProps = {
  userId: number;
  meId?: number;

  name: string;
  avatarSrc?: string;
  bio?: string;
  followers?: number;
  following?: number;
  isMe?: boolean;
  isFollowing?: boolean;

  actionDisabled?: boolean;

  onEdit?: () => void;
  onLogout?: () => void;
  onFollowToggle?: () => void;
};

export default function ProfileCard({
  userId,
  meId,
  name,
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
  const [isFollowModalOpen, setIsFollowModalOpen] = useState(false);
  const [followModalType, setFollowModalType] = useState<'followers' | 'following' | null>(null);
  const hasFollowers = followers > 0;
  const hasFollowing = following > 0;

  const [isRedirectOpen, setIsRedirectOpen] = useState(false);
  const openModal = (type: 'followers' | 'following') => {
    if ((type === 'followers' && followers === 0) || (type === 'following' && following === 0))
      return;
    setFollowModalType(type);
    setIsFollowModalOpen(true);
  };

  const onKeyOpen: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      const target = (e.currentTarget.dataset.type as 'followers' | 'following')!;
      openModal(target);
    }
  };

  const handleFollowClick = () => {
    if (!meId) {
      setIsRedirectOpen(true);
      return;
    }
    onFollowToggle?.();
  };

  return (
    <div className={CARD_CONTAINER}>
      <SafeProfileImage
        wrapperClassName={IMG_WRAPPER}
        imgClassName={IMG_STYLE}
        src={avatarSrc}
        alt={name}
        width={120}
        height={120}
      />

      <div className={PROFILE_TEXT_WRAPPER}>
        <h3 className='text-xl-semibold text-white'>{name || '-'}</h3>
        <p className='text-md-regular mt-[10px] text-left text-gray-600'>{bio}</p>
      </div>

      <div className={FOLLOW_INFO_WRAPPER}>
        <div
          className={FOLLOW_BOX_LEFT}
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
        <div
          className={'inline-flex w-[50%] flex-col items-center text-center'}
          role='button'
          tabIndex={0}
          data-type='following'
          onClick={() => openModal('following')}
          onKeyDown={onKeyOpen}
          aria-label='팔로잉 보기'
        >
          <strong
            className={clsx(FOLLOW_COUNT, hasFollowers ? 'cursor-pointer' : 'cursor-default')}
          >
            {following}
          </strong>
          <span className={clsx(FOLLOW_LABEL, hasFollowers ? 'cursor-pointer' : 'cursor-default')}>
            팔로잉
          </span>
        </div>
      </div>

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
              'block !w-full max-w-none', // 100% 강제
              'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-60',
              'disabled:hover:!border-gray-700 disabled:hover:!bg-transparent disabled:hover:!text-gray-500 disabled:hover:!brightness-100',
            )}
          >
            {isFollowing ? '팔로우 취소' : '팔로우'}
          </Button>
        )}
      </div>

      {isFollowModalOpen && followModalType && (
        <FollowModal
          userId={userId}
          meId={meId}
          type={followModalType}
          nickname={name}
          isOpen={isFollowModalOpen}
          onClose={() => setIsFollowModalOpen(false)}
        />
      )}

      <RedirectModal isOpen={isRedirectOpen} onClose={() => setIsRedirectOpen(false)} />
    </div>
  );
}

const IMG_WRAPPER =
  'mx-auto h-[120px] w-[120px] xl:w-[180px] xl:h-[180px] overflow-hidden rounded-full';
const IMG_STYLE = 'h-full w-full object-cover';

const CARD_CONTAINER =
  'bg-black-800 border border-black-700 w-full md:w-[509px] mx-auto xl:w-[340px] rounded-[12px] px-[30px] py-[20px] md:py-[30px] xl:py-[20px] xl:pt-[40px] xl:pb-[30px]'; // ← 오타 수정

const PROFILE_TEXT_WRAPPER = 'mt-[30px] flex flex-col items-center gap-[10px] text-center';

const FOLLOW_INFO_WRAPPER = 'mt-[30px] flex justify-between text-center';
const FOLLOW_BOX_LEFT =
  'w-[50%] border-r border-r-black-700 inline-flex flex-col items-center text-center ';
const FOLLOW_COUNT = 'text-base-semibold  text-white hover:text-main';
const FOLLOW_LABEL = 'text-md-regular  text-gray-400';

const BUTTON_GROUP = 'mt-[30px] flex flex-col gap-[10px]';
const BUTTON_BASE = 'text-base-semibold w-full rounded-[8px] py-[15px] transition cursor-pointer';
const BTN_EDIT = 'bg-main text-black-800 hover:opacity-90';
const BTN_LOGOUT = 'border border-black-700 text-gray-400 hover:bg-black-700';
