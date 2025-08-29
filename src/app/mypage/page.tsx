'use client';

import React from 'react';

import ProfileBadge from '@/shared/components/card/avtatarCard';
import { buildRankingMap } from '@/shared/utils/rankingUtil';

const AVATAR = '/images/profileImg.jpg';

const items = [
  { id: 101, name: '리뷰왕', avatarSrc: AVATAR, followers: 682, reviewCount: 398, rating: 5 },
  { id: 102, name: '리뷰왕', avatarSrc: AVATAR, followers: 682, reviewCount: 398, rating: 4 },
  {
    id: 103,
    name: '리뷰왕리뷰왕리뷰왕리뷰왕',
    avatarSrc: AVATAR,
    followers: 800,
    reviewCount: 38,
    rating: 3,
  },
  {
    id: 105,
    name: '리뷰왕리뷰왕리뷰왕리뷰왕',
    avatarSrc: AVATAR,
    followers: 800,
    reviewCount: 38,
    rating: 3,
  },
];

const MyPage = () => {
  const rankingMap = buildRankingMap(items);

  return (
    <div className='space-y-4 px-[20px]'>
      {/* 메인페이지 랭킹 카드: rank 대신 id + rankingMap 전달 */}
      {items.map((item) => (
        <ProfileBadge
          key={item.id}
          variant='ranking'
          id={item.id}
          name={item.name}
          avatarSrc={item.avatarSrc}
          followers={item.followers}
          review={item.reviewCount}
          rating={item.rating}
          rankingMap={rankingMap} // 부모에서 만든 맵
        />
      ))}

      {/* 리뷰페이지 카드 */}
      <ProfileBadge
        variant='reviewProfile'
        id={999}
        name='리뷰왕코'
        avatarSrc={AVATAR}
        rating={3}
      />

      {/* 팔로워 목록 카드 */}
      <ProfileBadge variant='follower' id={1000} name='미끄럼틀' avatarSrc={AVATAR} />
    </div>
  );
};

export default MyPage;
