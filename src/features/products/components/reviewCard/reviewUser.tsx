import Link from 'next/link';

import ProfileBadge from '@/shared/components/card/avatarCard';
interface ReviewUserProps {
  userId: number;
  name: string;
  avatarSrc: string;
  rating: number;
}

const ReviewUser = ({ userId, name, avatarSrc, rating }: ReviewUserProps) => {
  return (
    <Link href={`/user/${userId}`} className='flex items-center'>
      <div className='flex items-center'>
        <ProfileBadge
          variant='reviewProfile'
          id={userId}
          name={name}
          avatarSrc={avatarSrc}
          rating={rating}
          aria-label={`${name}님의 프로필과 별점 ${rating}점`}
        />
      </div>
    </Link>
  );
};

export default ReviewUser;
