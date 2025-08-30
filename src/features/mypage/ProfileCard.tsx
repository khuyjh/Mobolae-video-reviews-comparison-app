import clsx from 'clsx';

export default function ProfileCard() {
  return (
    <div className='bg-black-800 w-[334px] rounded-[12px] border border-[#353542] px-[30px] py-[20px]'>
      <div className='mx-auto h-[120px] w-[120px] overflow-hidden rounded-full'>
        <img
          src='/images/profileImg.jpg'
          alt='프로필 이미지'
          className='h-full w-full object-cover'
        />
      </div>

      <div className='mt-[30px] flex flex-col items-center gap-[10px] text-center'>
        <span className='text-xl-semibold text-white'>surisuri마수리</span>
        <div className='md-regular mt-[10px] text-left text-gray-600'>
          세상에 리뷰 못할 제품은 없다. surisuri마수리와 함께라면 당신도 프로쇼핑러! 안녕하세요,
          별점의 화신 surisuri마수리입니다!
        </div>
      </div>

      <div className='mt-[30px] flex justify-between text-center'>
        <div className='border-r-black-700 w-[50%] border-r'>
          <strong className='text-base-semibold block text-white'>762</strong>
          <span className='text-md-regular block text-gray-400'>팔로워</span>
        </div>
        <div className='w-[50%]'>
          <strong className='text-base-semibold block text-white'>102</strong>
          <span className='text-md-regular block text-gray-400'>팔로잉</span>
        </div>
      </div>

      <button className='bg-main text-base-semibold text-black-800 mt-[30px] w-full rounded-[8px] py-[15px]'>
        팔로우
      </button>
    </div>
  );
}
