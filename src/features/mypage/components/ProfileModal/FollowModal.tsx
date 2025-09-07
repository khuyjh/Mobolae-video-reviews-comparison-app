import React from 'react';
import { useState } from 'react';

import BaseModal from '@/shared/components/BaseModal';
import ProfileBadge from '@/shared/components/card/avatarCard';

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
  {
    id: 106,
    name: '리뷰왕리뷰왕리뷰왕리뷰왕',
    avatarSrc: AVATAR,
    followers: 800,
    reviewCount: 38,
    rating: 3,
  },
  {
    id: 107,
    name: '리뷰왕리뷰왕리뷰왕리뷰왕',
    avatarSrc: AVATAR,
    followers: 800,
    reviewCount: 38,
    rating: 3,
  },
];

const FollowModal: React.FC = () => {
  const [open, setOpen] = useState(true);
  return (
    <BaseModal title='비교 상품 교체 선택' size='L' isOpen={open} onClose={() => setOpen(false)}>
      <div className='px-[30px]'>
        <h3 className='text-2xl-semibold mb-[40px]'>surisuri마수리님을 팔로우하는 유저</h3>
        <div className='h-[514px] overflow-y-scroll'>
          {items.map((items) => (
            <ProfileBadge
              key={items.id}
              variant='follower'
              id={items.id}
              name={items.name}
              avatarSrc={items.avatarSrc}
            />
          ))}
        </div>
      </div>
    </BaseModal>
  );
};

export default FollowModal;
