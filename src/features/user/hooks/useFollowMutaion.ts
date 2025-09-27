'use client';

import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { PATH_OPTION } from '@/shared/constants/constants';

import { useFollow, useUnfollow } from '../../../..//openapi/queries/queries';
import * as Common from '../../../../openapi/queries/common';

import type {
  UserDetailDefaultResponse, // 사용자 상세 응답 타입
  ListUserFollowersDefaultResponse, // 팔로워 리스트 응답 타입
  ListUserFolloweesDefaultResponse, // 팔로잉 리스트 응답 타입
  FollowMutationResult, // 팔로우 요청 결과 타입
  UnfollowMutationResult, // 언팔로우 요청 결과 타입
} from '../../../..//openapi/queries/common';

type Snapshot = {
  prevUserDetail?: UserDetailDefaultResponse;
  prevFollowers?: ListUserFollowersDefaultResponse;
  prevFollowees?: ListUserFolloweesDefaultResponse;
};

// targetUserId: 프로필 주인 / meUserId: 로그인 사용자(선택)
export function useFollowMutations(targetUserId: number, meUserId?: number, toastLabel?: string) {
  const queriesClient = useQueryClient(); // react-query 캐시 클라이언트
  const followMut = useFollow<FollowMutationResult>(); // 팔로우 API 호출용 훅
  const unfollowMut = useUnfollow<UnfollowMutationResult>(); // 언팔로우 API 호출용 훅

  const isAuthed = !!meUserId; // 내가 로그인이 되었는지

  const withUserId = (userId: number) => ({
    ...PATH_OPTION,
    path: { ...PATH_OPTION.path, userId },
  });

  // react-query 키
  const userDetailKey = Common.UseUserDetailKeyFn(
    // 특정 유저 상세정보 쿼리 키
    withUserId(targetUserId),
    undefined,
  );
  const followersKey = Common.UseListUserFollowersKeyFn(
    // 특정 유저의 팔로워 목록 쿼리 키

    withUserId(targetUserId),
    undefined,
  );
  const myFolloweesKey = meUserId
    ? Common.UseListUserFolloweesKeyFn(
        // 로그인한 유저가 팔로우하는 목록(내 팔로잉)
        withUserId(meUserId),
        undefined,
      )
    : undefined;

  // 서버 값으로 재요청
  const refetchAll = async () => {
    await Promise.all([
      queriesClient.invalidateQueries({ queryKey: userDetailKey }), // 유저 상세 다시 불러오기
      queriesClient.invalidateQueries({ queryKey: followersKey }), // 팔로워 목록 다시 불러오기
      myFolloweesKey
        ? queriesClient.invalidateQueries({ queryKey: myFolloweesKey }) // 내 팔로잉도 갱신(로그인 시)
        : Promise.resolve(),
    ]);
  };

  // 타입 안전한 낙관적 업데이트
  const patchFollowersList = (next: boolean) => {
    // 팔로워 목록
    queriesClient.setQueryData<ListUserFollowersDefaultResponse>(followersKey, (prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        list: prev.list.map((row) =>
          row.follower.id === targetUserId // 대상 유저 항목만
            ? { ...row, follower: { ...row.follower, isFollowing: next } }
            : row,
        ),
      };
    });

    // 내 팔로잉 목록
    if (myFolloweesKey) {
      queriesClient.setQueryData<ListUserFolloweesDefaultResponse>(myFolloweesKey, (prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          list: prev.list.map((row) =>
            row.followee.id === targetUserId
              ? { ...row, followee: { ...row.followee, isFollowing: next } }
              : row,
          ),
        };
      });
    }
  };
  const getSnapshots = () => {
    const prevUserDetail = queriesClient.getQueryData<UserDetailDefaultResponse>(userDetailKey);
    const prevFollowers =
      queriesClient.getQueryData<ListUserFollowersDefaultResponse>(followersKey);
    const prevFollowees = myFolloweesKey
      ? queriesClient.getQueryData<ListUserFolloweesDefaultResponse>(myFolloweesKey)
      : undefined;

    return { prevUserDetail, prevFollowers, prevFollowees } satisfies Snapshot;
  };
  const rollback = (snap: Snapshot) => {
    if (snap.prevUserDetail) queriesClient.setQueryData(userDetailKey, snap.prevUserDetail);
    if (snap.prevFollowers) queriesClient.setQueryData(followersKey, snap.prevFollowers);
    if (myFolloweesKey && snap.prevFollowees)
      queriesClient.setQueryData(myFolloweesKey, snap.prevFollowees);
  };

  /** 팔로우 실행 */
  const follow = () => {
    const snap = getSnapshots();
    // 상세 즉시 반영(+1)
    queriesClient.setQueryData<UserDetailDefaultResponse>(userDetailKey, (prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        isFollowing: true,
        followersCount: Math.max(0, (prev.followersCount ?? 0) + 1),
      };
    });
    patchFollowersList(true);

    // 실제 서버 호출 (body.userId 필수)
    followMut.mutate(
      {
        ...PATH_OPTION,
        path: { ...PATH_OPTION.path, userId: targetUserId },
        body: { userId: targetUserId },
      },
      {
        onSuccess: () => {
          toast.success(toastLabel ? `${toastLabel}님을 팔로우했습니다` : '팔로우했습니다');
        },
        onError: () => {
          rollback(snap);
          toast.error(
            toastLabel ? `${toastLabel}님 팔로우에 실패했습니다` : '팔로우에 실패했습니다',
          );
        },
        onSettled: () => void refetchAll(),
      },
    );
  };

  /** 언팔로우 실행 */
  const unfollow = () => {
    const snap = getSnapshots();
    // 상세 즉시 반영(-1)
    queriesClient.setQueryData<UserDetailDefaultResponse>(userDetailKey, (prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        isFollowing: false,
        followersCount: Math.max(0, (prev.followersCount ?? 0) - 1),
      };
    });
    patchFollowersList(false);

    // 실제 서버 호출 (스펙상 body 필요 시 동일 전달)
    unfollowMut.mutate(
      {
        ...PATH_OPTION,
        path: { ...PATH_OPTION.path, userId: targetUserId },
        body: { userId: targetUserId },
      },
      {
        onSuccess: () => {
          toast.success(toastLabel ? `${toastLabel}님을 언팔로우했습니다` : '언팔로우했습니다');
        },
        onError: () => {
          rollback(snap);
          toast.error(
            toastLabel ? `${toastLabel}님 언팔로우에 실패했습니다` : '언팔로우에 실패했습니다',
          );
        },
        onSettled: () => void refetchAll(),
      },
    );
  };

  return {
    follow,
    unfollow,

    actionDisabled: !isAuthed || followMut.isPending || unfollowMut.isPending,
  };
}
