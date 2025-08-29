import ProfileBadge from '@/shared/components/card/avatarCard';

interface ReviewUserProps {
  name: string;
  avatarSrc: string;
  rating: number;
}

const ReviewUser = ({ name, avatarSrc, rating }: ReviewUserProps) => {
  return (
    <div className='flex items-center'>
      <ProfileBadge
        variant='reviewProfile'
        id={1} // 더미 ID
        name={name}
        avatarSrc={avatarSrc}
        rating={rating}
        aria-label={`${name}님의 프로필과 별점 ${rating}점`}
      />
    </div>
  );
};

export default ReviewUser;
