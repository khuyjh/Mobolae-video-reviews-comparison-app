// 프로필 이미지, 닉네임, 별점

import Image from 'next/image';

interface ReviewUserProps {
  userProfileImage: string;
  userNickname: string;
  rating: number;
}

const ReviewUser = ({ userProfileImage, userNickname, rating }: ReviewUserProps) => {
  return (
    <div className='flex items-center space-x-2'>
      <div className='relative h-10 w-10 overflow-hidden rounded-full'>
        <Image
          src={userProfileImage}
          alt={`${userNickname} 프로필`}
          fill
          className='object-cover'
        />
      </div>
      <div className='flex flex-col'>
        <span className='text-base font-semibold'>{userNickname}</span>
        <div className='flex items-center space-x-1 text-yellow-400'>
          {Array.from({ length: 5 }, (_, i) => (
            <span key={i} className={i < rating ? 'text-yellow-400' : 'text-gray-600'}>
              ★
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReviewUser;
