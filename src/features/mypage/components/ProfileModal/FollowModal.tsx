import Link from 'next/link';

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

type FollowModalProps = {
  type: 'followers' | 'following' | null;
  isOpen: boolean;
  onClose: () => void;
};

const FollowModal: React.FC<FollowModalProps> = ({ type, isOpen, onClose }) => {
  if (!type) return null;

  const followTitle = type === 'followers' ? '님을 팔로우하는' : '님이 팔로잉하는';
  const title = type === 'followers' ? '팔로우 목록' : '팔로잉 목록';

  return (
    <BaseModal title={title} size='M' isOpen={isOpen} onClose={onClose}>
      <div className='px-[10px] md:px-[30px]'>
        <h3 className='xl:text-2xl-semibold text-xl-semibold mb-[20px] xl:mb-[40px]'>
          surisuri마수리{followTitle}유저
        </h3>
        <div className='h-[514px] overflow-y-scroll'>
          {items.map((items) => (
            <Link key={items.id} href={`/users/${items.id}`}>
              <ProfileBadge
                key={items.id}
                variant='follower'
                id={items.id}
                name={items.name}
                avatarSrc={items.avatarSrc}
              />
            </Link>
          ))}
        </div>
      </div>
    </BaseModal>
  );
};

export default FollowModal;
