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
    <Link
      href={`/user/${userId}`}
      className='flex items-center'
      aria-label={`${name}님의 프로필 페이지로 이동 (별점 ${rating}점)`}
    >
      <ProfileBadge
        variant='reviewProfile'
        id={userId}
        name={name}
        avatarSrc={avatarSrc}
        rating={rating}
      />
    </Link>
  );
};

export default ReviewUser;
