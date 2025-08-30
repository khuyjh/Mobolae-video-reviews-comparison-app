import clsx from 'clsx';

type ProfileCardProps = {
  name: string;
  avatarSrc: string;
  bio?: string;
  followers?: number;
  following?: number;

  isMe?: boolean;
  isFollowing?: boolean;
  onFollowToggle?: () => void;
  onEdit?: () => void;
  onLogout?: () => void;
};

export default function ProfileCard({
  name,
  avatarSrc,
  bio,
  followers = 0,
  following = 0,
  isMe = false,
  isFollowing,
  onFollowToggle,
  onEdit,
  onLogout,
}: ProfileCardProps) {
  return (
    <div className='bg-black-800 w-[334px] rounded-[12px] border border-[#353542] px-[30px] py-[20px] md:w-[509px] xl:w-[340px]'>
      {/* 프로필 이미지 */}
      <div className='mx-auto h-[120px] w-[120px] overflow-hidden rounded-full'>
        <img src={avatarSrc} alt={`${name} 프로필 이미지`} className='h-full w-full object-cover' />
      </div>

      {/* 프로필 이름 / 소개글 */}
      <div className='mt-[30px] flex flex-col items-center gap-[10px] text-center'>
        <h3 className='text-xl-semibold text-white'>{name}</h3>
        <p className='md-regular mt-[10px] text-left text-gray-600'>{bio}</p>
      </div>

      {/* 팔로워 팔로잉 */}
      <div className='mt-[30px] flex justify-between text-center'>
        <div className='border-r-black-700 w-[50%] border-r'>
          <strong className='text-base-semibold block text-white'>{followers}</strong>
          <span className='text-md-regular block text-gray-400'>팔로워</span>
        </div>
        <div className='w-[50%]'>
          <strong className='text-base-semibold block text-white'>{following}</strong>
          <span className='text-md-regular block text-gray-400'>팔로잉</span>
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className='mt-[30px] flex flex-col gap-[10px]'>
        {isMe ? (
          <>
            {/* 내 프로필*/}
            <button
              onClick={onEdit}
              className='bg-main text-base-semibold text-black-800 w-full rounded-[8px] py-[15px] hover:opacity-90'
            >
              편집하기
            </button>
            <button
              onClick={onLogout}
              className='text-base-semibold hover:bg-black-700/40 w-full rounded-[8px] border border-[#353542] py-[15px] text-gray-400'
            >
              로그아웃
            </button>
          </>
        ) : (
          <button
            onClick={onFollowToggle}
            className={clsx(
              'text-base-semibold w-full rounded-[8px] py-[15px] transition',
              isFollowing
                ? 'hover:bg-black-700/40 border border-[#353542] text-gray-400'
                : 'bg-main-gradient text-black-800 hover:opacity-90',
            )}
          >
            {isFollowing ? '팔로우 취소' : '팔로우'}
          </button>
        )}
      </div>
    </div>
  );
}
