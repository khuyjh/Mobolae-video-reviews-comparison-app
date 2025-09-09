'use client';
import clsx from 'clsx';
import { useState } from 'react';

import FollowModal from '@/features/mypage/components/ProfileModal/FollowModal';
import { TEAM_ID } from '@/shared/constants/constants';

import { useMe, useUserDetail } from '../../../../openapi/queries/queries';

import type {
  MeDefaultResponse,
  UserDetailDefaultResponse,
} from '../../../../openapi/queries/common';

//공통 카드 타입
type CardData = {
  name: string;
  avatarSrc: string;
  bio: string;
  followers: number;
  following: number;
  isMe: boolean;
  isFollowing: boolean;
};

// 내 프로필 카드응답
const mapMeToCard = (u?: MeDefaultResponse): CardData => ({
  name: u?.nickname ?? '',
  avatarSrc: u?.image ?? '/images/profileImg.jpg',
  bio: u?.description ?? '',
  followers: u?.followersCount ?? 0,
  following: u?.followeesCount ?? 0,
  isMe: true,
  isFollowing: false,
});

// 유저프로필 프로필 카드응답
const mapUserToCard = (u?: UserDetailDefaultResponse): CardData => ({
  name: u?.nickname ?? '',
  avatarSrc: u?.image ?? '/images/profileImg.jpg',
  bio: u?.description ?? '',
  followers: u?.followersCount ?? 0,
  following: u?.followeesCount ?? 0,
  isMe: false,
  isFollowing: Boolean(u?.isFollowing),
});

// mypage
export default function ProfileCard() {
  const { data } = useMe({ path: { teamId: TEAM_ID as string } }, ['me']);

  const card: CardData = mapMeToCard(data);

  return (
    <ProfileCardView
      name={card.name}
      avatarSrc={card.avatarSrc}
      bio={card.bio}
      followers={card.followers}
      following={card.following}
      isMe={card.isMe}
      isFollowing={card.isFollowing}
      onEdit={() => {}}
      onLogout={() => {}}
    />
  );
}

// uesr/[userId]
export function UserProfileCard({ userId }: { userId: string | number | undefined }) {
  const uidStr = String(userId ?? '');
  const uidNum = Number.parseInt(uidStr, 10);
  const isReady = Number.isFinite(uidNum);

  const { data } = useUserDetail(
    { path: { teamId: TEAM_ID as string, userId: uidNum } },
    undefined,
    { enabled: isReady && !!TEAM_ID, retry: false },
  );

  const card = mapUserToCard(data);
  return (
    <ProfileCardView
      name={card.name}
      avatarSrc={card.avatarSrc}
      bio={card.bio}
      followers={card.followers}
      following={card.following}
      isMe={false}
      isFollowing={card.isFollowing}
      onFollowToggle={() => {}}
    />
  );
}

// 프로필카드 UI
type ProfileCardProps = {
  name: string;
  avatarSrc: string;
  bio?: string;
  followers?: number;
  following?: number;
  isMe?: boolean;
  isFollowing?: boolean;
  onFollowToggle?: () => void;
  onEdit?: () => void;
  onLogout?: () => void;
};

function ProfileCardView({
  name,
  avatarSrc,
  bio,
  followers = 0,
  following = 0,
  isMe = true,
  isFollowing,
  onFollowToggle,
  onEdit,
  onLogout,
}: ProfileCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'followers' | 'following' | null>(null);

  return (
    <div className={CARD_CONTAINER}>
      <div className={IMG_WRAPPER}>
        <img src={avatarSrc} alt={`${name || '-'} 프로필 이미지`} className={IMG_STYLE} />
      </div>

      <div className={PROFILE_TEXT_WRAPPER}>
        <h3 className='text-xl-semibold text-white'>{name || '-'}</h3>
        <p className='text-md-regular mt-[10px] text-left text-gray-600'>{bio}</p>
      </div>

      <div className={FOLLOW_INFO_WRAPPER}>
        <div
          className={FOLLOW_BOX_LEFT}
          onClick={() => {
            setModalType('followers');
            setIsModalOpen(true);
          }}
          role='button'
          tabIndex={0}
        >
          <strong className={FOLLOW_COUNT}>{followers}</strong>
          <span className={FOLLOW_LABEL}>팔로워</span>
        </div>
        <div
          className='w-[50%]'
          onClick={() => {
            setModalType('following');
            setIsModalOpen(true);
          }}
          role='button'
          tabIndex={0}
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
            aria-label={`${name || '-'}을(를) ${isFollowing ? '언팔로우' : '팔로우'}하기`}
            className={clsx(BUTTON_BASE, isFollowing ? BTN_UNFOLLOW : BTN_FOLLOW)}
          >
            {isFollowing ? '팔로우 취소' : '팔로우'}
          </button>
        )}
      </div>

      {isModalOpen && (
        <FollowModal type={modalType} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
}

// ---------- 스타일 상수 ----------
const CARD_CONTAINER =
  'bg-black-800 border border-black-700 w-full md:w-[509px] mx-auto xl:w-[340px] rounded-[12px] px-[30px] py-[20px] md:py-[30px] xl:py-[20px] xl:pt-[40px] xl:pb-[30px]';
const IMG_WRAPPER =
  'mx-auto h-[120px] w-[120px] xl:w-[180px] xl:h-[180px] overflow-hidden rounded-full';
const IMG_STYLE = 'h-full w-full object-cover';
const PROFILE_TEXT_WRAPPER = 'mt-[30px] flex flex-col items-center gap-[10px] text-center';
const FOLLOW_INFO_WRAPPER = 'mt-[30px] flex justify-between text-center';
const FOLLOW_BOX_LEFT = 'w-[50%] border-r border-r-black-700  cursor-pointer';
const FOLLOW_COUNT = 'text-base-semibold block text-white  cursor-pointer';
const FOLLOW_LABEL = 'text-md-regular block text-gray-400  cursor-pointer';
const BUTTON_GROUP = 'mt-[30px] flex flex-col gap-[10px]';
const BUTTON_BASE = 'text-base-semibold w-full rounded-[8px] py-[15px] transition cursor-pointer';
const BTN_EDIT = 'bg-main text-black-800 hover:opacity-90';
const BTN_LOGOUT = 'border border-black-700 text-gray-400 hover:bg-black-700/40';
const BTN_FOLLOW = 'bg-main-gradient text-black-800 hover:brightness-120';
const BTN_UNFOLLOW = 'border border-black-700 text-gray-400 hover:brightness-110';
