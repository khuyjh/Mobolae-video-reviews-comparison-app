'use client';

import clsx from 'clsx';
import { useState } from 'react';

import FollowModal from '@/features/mypage/components/ProfileModal/FollowModal';

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'followers' | 'following' | null>(null);
  const safeSrc = avatarSrc?.trim() ? avatarSrc : undefined;

  const openModal = (type: 'followers' | 'following') => {
    if ((type === 'followers' && followers === 0) || (type === 'following' && following === 0))
      return;
    setModalType(type);
    setIsModalOpen(true);
  };

  const onKeyOpen: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      const t = (e.currentTarget.dataset.type as 'followers' | 'following')!;
      openModal(t);
    }
  };

  return (
    <div className={CARD_CONTAINER}>
      {/*<SafeProfileImage src={avatarSrc} alt={name} width={120} height={120} />*/}

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
          <strong className={FOLLOW_COUNT}>{followers}</strong>
          <span className={FOLLOW_LABEL}>팔로워</span>
        </div>
        <div
          className='w-[50%]'
          role='button'
          tabIndex={0}
          data-type='following'
          onClick={() => openModal('following')}
          onKeyDown={onKeyOpen}
          aria-label='팔로잉 보기'
        >
          <strong className={FOLLOW_COUNT}>{following}</strong>
          <span className={FOLLOW_LABEL}>팔로잉</span>
        </div>
      </div>

      <div className={BUTTON_GROUP}>
        {isMe ? (
          <>
            <button onClick={onEdit} className={clsx(BUTTON_BASE, BTN_EDIT)}>
              편집하기
            </button>
            <button onClick={onLogout} className={clsx(BUTTON_BASE, BTN_LOGOUT)}>
              로그아웃
            </button>
          </>
        ) : (
          <button
            onClick={onFollowToggle}
            disabled={actionDisabled}
            aria-busy={actionDisabled || undefined}
            aria-label={`${name || '-'}을(를) ${isFollowing ? '언팔로우' : '팔로우'}하기`}
            className={clsx(
              BUTTON_BASE,
              isFollowing ? BTN_UNFOLLOW : BTN_FOLLOW,
              actionDisabled && 'cursor-not-allowed opacity-60',
            )}
          >
            {isFollowing ? '팔로우 취소' : '팔로우'}
          </button>
        )}
      </div>

      {isModalOpen && (
        <FollowModal
          userId={userId}
          meId={meId}
          type={modalType}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}

const CARD_CONTAINER =
  'bg-black-800 border border-black-700 w-full md:w-[509px] mx-auto xl:w-[340px] rounded-[12px] px-[30px] py-[20px] md:py-[30px] xl:py-[20px] xl:pt-[40px] xl:pb-[30px]';

const PROFILE_TEXT_WRAPPER = 'mt-[30px] flex flex-col items-center gap-[10px] text-center';

const FOLLOW_INFO_WRAPPER = 'mt-[30px] flex justify-between text-center';
const FOLLOW_BOX_LEFT = 'w-[50%] border-r border-r-black-700 cursor-pointer';
const FOLLOW_COUNT = 'text-base-semibold block text-white cursor-pointer';
const FOLLOW_LABEL = 'text-md-regular block text-gray-400 cursor-pointer';

const BUTTON_GROUP = 'mt-[30px] flex flex-col gap-[10px]';
const BUTTON_BASE = 'text-base-semibold w-full rounded-[8px] py-[15px] transition cursor-pointer';
const BTN_EDIT = 'bg-main text-black-800 hover:opacity-90';
const BTN_LOGOUT = 'border border-black-700 text-gray-400 hover:bg-black-700/40';
const BTN_FOLLOW = 'bg-main-gradient text-black-800 hover:brightness-120';
const BTN_UNFOLLOW = 'border border-black-700 text-gray-400 hover:brightness-110';
