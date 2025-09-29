'use client';

import Link from 'next/link';

import React from 'react';

import BaseModal from '@/shared/components/BaseModal';
import ProfileBadge from '@/shared/components/card/avatarCard';
import { TEAM_ID } from '@/shared/constants/constants';
import { useUserStore } from '@/shared/stores/userStore';

import { useListUserFollowers, useListUserFollowees } from '../../../../../openapi/queries/queries';

import type {
  ListUserFollowersDefaultResponse,
  ListUserFolloweesDefaultResponse,
} from '../../../../../openapi/queries/common';

// 응답 타입에서 리스트 아이템 타입만 추출
type FollowersResp = NonNullable<ListUserFollowersDefaultResponse>;
type FolloweesResp = NonNullable<ListUserFolloweesDefaultResponse>;

type FollowerRow = FollowersResp['list'][number]; // follower: User
type FolloweeRow = FolloweesResp['list'][number]; // followee: User

// follower/followee를 공통 UserLite 타입으로 통합
type UserLite = (FollowerRow['follower'] | FolloweeRow['followee']) & {
  isFollowing?: boolean;
};

type FollowModalProps = {
  userId: number;
  nickname?: string;
  type: 'followers' | 'following' | null; // 팔로워/팔로잉 구분
  isOpen: boolean;
  onClose: () => void;
};

// 팔로워/팔로잉 목록 모달
export default function FollowModal({ userId, nickname, type, isOpen, onClose }: FollowModalProps) {
  const isFollowers = type === 'followers';
  const isFollowees = type === 'following';
  const open = Boolean(isOpen && type);

  // 팔로워/팔로잉 API 호출 (열렸을 때만 실행)
  const followersQ = useListUserFollowers(
    { path: { teamId: TEAM_ID as string, userId } },
    undefined,
    { enabled: open && isFollowers },
  );
  const followeesQ = useListUserFollowees(
    { path: { teamId: TEAM_ID as string, userId } },
    undefined,
    { enabled: open && isFollowees },
  );

  if (!open) return null;

  // 모달 제목과 부제
  const username = `${nickname}`;
  const title = isFollowers ? '팔로워 목록' : '팔로잉 목록';
  const subtitle = isFollowers ? '님을 팔로우하는 유저' : '님이 팔로잉하는 유저';

  // API 응답을 UserLite 형태로 변환
  const followerUsers: UserLite[] = isFollowers
    ? (followersQ.data?.list ?? []).map((row) => ({
        ...row.follower,
        isFollowing: false,
      }))
    : [];

  const followeeUsers: UserLite[] = isFollowees
    ? (followeesQ.data?.list ?? []).map((row) => ({
        ...row.followee,
        isFollowing: false,
      }))
    : [];

  const users: UserLite[] = isFollowers ? followerUsers : followeeUsers;
  const loading = isFollowers ? followersQ.isLoading : followeesQ.isLoading;

  return (
    <BaseModal title={title} size='M' isOpen={isOpen} onClose={onClose}>
      <div className='px-[10px] md:px-[30px]'>
        <h3 className='xl:text-2xl-semibold text-xl-semibold mb-[20px] xl:mb-[40px]'>
          {username}
          {subtitle}
        </h3>

        <div className='h-[514px] overflow-y-auto pr-1'>
          {/* 로딩/빈 목록/리스트 렌더링 */}
          {loading && <p className='text-gray-400'>불러오는 중…</p>}
          {!loading && users.length === 0 && <p className='text-gray-500'>목록이 비어 있어요.</p>}

          {users.map((u) => (
            <UserRow key={u.id} user={u} />
          ))}
        </div>
      </div>
    </BaseModal>
  );
}

// 유저 한 줄 렌더링 컴포넌트
function UserRow({ user }: { user: UserLite }) {
  const meId = useUserStore((state) => state.user?.id);
  const userId = user.id;

  // 자기 자신이면 /mypage로, 아니면 /user/[id]로 이동
  const getHref = (userId: number) => (meId && userId === meId ? '/mypage' : `/user/${userId}`);

  return (
    <div className='flex items-center justify-between py-2'>
      <Link href={getHref(userId)} className='min-w-0'>
        <ProfileBadge
          variant='follower'
          id={user.id}
          name={user.nickname}
          avatarSrc={user.image ?? ''}
        />
      </Link>
    </div>
  );
}
