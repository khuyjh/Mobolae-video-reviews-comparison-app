'use client';

import React from 'react';

import ProfileBadge from '@/shared/components/card/avtataCard';
const AVATAR = '/images/profileImg.jpg';
const MyPage = () => {
  return (
    <div className='space-y-4 px-[20px]'>
      {/*메인페이지에 들어 갈 아바타 카드*/}
      <ProfileBadge
        variant='ranking'
        name='리뷰왕'
        avatarSrc={AVATAR}
        rank={1}
        followers={682}
        review={398}
      />
      <ProfileBadge
        variant='ranking'
        name='리뷰왕'
        avatarSrc={AVATAR}
        rank={2}
        followers={682}
        review={398}
      />
      <ProfileBadge
        variant='ranking'
        name='리뷰왕리뷰왕리뷰왕리뷰왕'
        avatarSrc={AVATAR}
        rank={3}
        followers={800}
        review={38}
      />

      {/*리뷰페이지 카드*/}
      <ProfileBadge variant='review_profile' name='리뷰왕' avatarSrc={AVATAR} rating={5} />

      {/*팔로워 목록 카드 */}
      <ProfileBadge variant='follower' name='미끄럼틀' avatarSrc={AVATAR} />
    </div>
  );
};

export default MyPage;
