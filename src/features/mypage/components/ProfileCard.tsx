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
    <div className={CARD_CONTAINER}>
      {/* 프로필 이미지 */}
      <div className={IMG_WRAPPER}>
        <img src={avatarSrc} alt={`${name} 프로필 이미지`} className={IMG_STYLE} />
      </div>

      {/* 프로필 이름 / 소개글 */}
      <div className={PROFILE_TEXT_WRAPPER}>
        <h3 className='text-xl-semibold text-white'>{name}</h3>
        <p className='text-md-regular mt-[10px] text-left text-gray-600'>{bio}</p>
      </div>

      {/* 팔로워 / 팔로잉 */}
      <div className={FOLLOW_INFO_WRAPPER}>
        <div className={FOLLOW_BOX_LEFT}>
          <strong className={FOLLOW_COUNT}>{followers}</strong>
          <span className={FOLLOW_LABEL}>팔로워</span>
        </div>
        <div className='w-[50%]'>
          <strong className={FOLLOW_COUNT}>{following}</strong>
          <span className={FOLLOW_LABEL}>팔로잉</span>
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className={BUTTON_GROUP}>
        {isMe ? (
          <>
            <button onClick={onEdit} className={clsx(BUTTON_BASE, BTN_EDIT)}>
              편집하기
            </button>
            <button onClick={onLogout} className={clsx(BUTTON_BASE, BTN_LOGOUT)}>
              로그아웃
            </button>
          </>
        ) : (
          <button
            onClick={onFollowToggle}
            aria-label={`${name}을(를) ${isFollowing ? '언팔로우' : '팔로우'}하기`}
            className={clsx(BUTTON_BASE, isFollowing ? BTN_UNFOLLOW : BTN_FOLLOW)}
          >
            {isFollowing ? '팔로우 취소' : '팔로우'}
          </button>
        )}
      </div>
    </div>
  );
}

const CARD_CONTAINER =
  'bg-black-800 border border-black-700 w-full md:w-[509px] mx-auto xl:w-[340px] rounded-[12px] px-[30px] py-[20px] md:py-[30px] xl:py-[20px] xl:pt-[40px] xl:pb-[30px]';

const IMG_WRAPPER =
  'mx-auto h-[120px] w-[120px] xl:w-[180px] xl:h-[180px] overflow-hidden rounded-full';
const IMG_STYLE = 'h-full w-full object-cover';

const PROFILE_TEXT_WRAPPER = 'mt-[30px] flex flex-col items-center gap-[10px] text-center';

const FOLLOW_INFO_WRAPPER = 'mt-[30px] flex justify-between text-center';
const FOLLOW_BOX_LEFT = 'w-[50%] border-r border-r-black-700';
const FOLLOW_COUNT = 'text-base-semibold block text-white';
const FOLLOW_LABEL = 'text-md-regular block text-gray-400';

const BUTTON_GROUP = 'mt-[30px] flex flex-col gap-[10px]';
const BUTTON_BASE = 'text-base-semibold w-full rounded-[8px] py-[15px] transition';

const BTN_EDIT = 'bg-main text-black-800 hover:opacity-90';
const BTN_LOGOUT = 'border border-black-700 text-gray-400 hover:bg-black-700/40';
const BTN_FOLLOW = 'bg-main-gradient text-black-800 hover:brightness-120';
const BTN_UNFOLLOW = 'border border-black-700 text-gray-400 hover:bg-black-700/40';
