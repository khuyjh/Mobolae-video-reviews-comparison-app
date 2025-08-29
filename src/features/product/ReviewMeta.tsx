// 작성 날짜, 조회수, 수정/삭제, 좋아요

interface ReviewMetaProps {
  viewCount: number;
  likeCount: number;
  isLiked: boolean;
  showActions: boolean;
  createdAt: string;
}

const ReviewMeta = ({ viewCount, likeCount, isLiked, showActions, createdAt }: ReviewMetaProps) => {
  return (
    <div className='flex items-center justify-between text-sm text-gray-500'>
      <div className='flex items-center space-x-4'>
        <span>조회수 {viewCount}</span>
        {showActions && (
          <div className='flex items-center space-x-2'>
            <button className='text-blue-400 hover:underline'>수정</button>
            <button className='text-red-400 hover:underline'>삭제</button>
          </div>
        )}
      </div>
      <div className='flex items-center space-x-2'>
        <div className='flex items-center space-x-1'>
          <span className={isLiked ? 'text-red-500' : 'text-gray-500'}>❤️</span>
          <span>{likeCount}</span>
        </div>
        <span>{createdAt}</span>
      </div>
    </div>
  );
};

export default ReviewMeta;
