'use client';

import React from 'react';
import { useState } from 'react';

import ActivityCard from '@/features/mypage/components/activityCard';
import ProfileCard from '@/features/mypage/components/ProfileCard';
import ProfileTabs from '@/features/mypage/components/ProfileTabs';
import HomeItemCard from '@/shared/components/HomeItemCard';

const AVATAR = '/images/profileImg.jpg';

const REVIEW_ITEMS = [
  { id: 1, title: '아이템 A', image: AVATAR, favoriteCount: 3, reviewCount: 5, rating: 4 },
  { id: 2, title: '아이템 B', image: AVATAR, favoriteCount: 10, reviewCount: 2, rating: 5 },
  { id: 3, title: '아이템 C', image: AVATAR, favoriteCount: 1, reviewCount: 0, rating: 3 },
  { id: 4, title: '아이템 C', image: AVATAR, favoriteCount: 1, reviewCount: 0, rating: 3 },
];

const MyPage = () => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [tab, setTab] = useState<'reviews' | 'items' | 'wishlist'>('reviews');

  const handleFollowToggle = () => {
    setIsFollowing((prev) => !prev);
  };

  return (
    <div className='mt-[30px] px-[20px] md:px-[117px] xl:mx-auto xl:flex xl:max-w-[1340px] xl:px-[0px]'>
      <div className='mb-[60px] xl:mr-[60px]'>
        {/*프로필 카드*/}
        <ProfileCard
          name='surisuri마수리'
          avatarSrc={AVATAR}
          bio='자기소개 입니다자기소개 입니다자기소개 입니다자기소개 입니다자기소개 입니다'
          followers={762}
          following={102}
          isFollowing={isFollowing}
          onFollowToggle={handleFollowToggle}
        />
      </div>
      <div>
        <div className='mb-[60px]'>
          <h2 className='text-lg-semibold mb-[30px] text-white'>활동 내역</h2>
          <div>
            {/*활동내역 카드*/}
            <ActivityCard rating={5} reviewCount={156} topCategoryId={2} />
          </div>
        </div>
        <div>
          {/*pc 탭메뉴 / 모바일 드롭다운 */}
          <ProfileTabs value={tab} onChange={setTab} />

          <div className='mt-6'>
            {tab === 'reviews' && (
              <div className='grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-3'>
                {REVIEW_ITEMS.map((item) => (
                  <HomeItemCard
                    key={item.id}
                    title={item.title}
                    contentImage={item.image}
                    favoriteCount={item.favoriteCount}
                    reviewCount={item.reviewCount}
                    rating={item.rating}
                    contentId={item.id}
                  />
                ))}
              </div>
            )}
            {tab === 'items' && (
              <div className='grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-3'>
                {REVIEW_ITEMS.map((item) => (
                  <HomeItemCard
                    key={item.id}
                    title={item.title}
                    contentImage={item.image}
                    favoriteCount={item.favoriteCount}
                    reviewCount={item.reviewCount}
                    rating={item.rating}
                    contentId={item.id}
                  />
                ))}
              </div>
            )}
            {tab === 'wishlist' && (
              <div className='grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-3'>
                {REVIEW_ITEMS.map((item) => (
                  <HomeItemCard
                    key={item.id}
                    title={item.title}
                    contentImage={item.image}
                    favoriteCount={item.favoriteCount}
                    reviewCount={item.reviewCount}
                    rating={item.rating}
                    contentId={item.id}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPage;
