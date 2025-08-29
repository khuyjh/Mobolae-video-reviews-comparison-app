import Image from 'next/image';

interface ReviewDescriptionProps {
  reviewContent: string;
  Images?: string[];
}

const ReviewDescription = ({ reviewContent, Images }: ReviewDescriptionProps) => {
  return (
    <div>
      <p className='text-xs-regular whitespace-pre-wrap text-white'>{reviewContent}</p>
      {Images && Images.length > 0 && (
        <div className='mt-[20px] flex space-x-[10px] overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
          {Images.map((imageSrc, index) => (
            <div key={index} className='relative h-[60px] w-[60px] flex-shrink-0 rounded-md'>
              <Image
                src={imageSrc}
                alt={`리뷰 이미지 ${index + 1}`}
                fill
                className='rounded-md object-cover'
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewDescription;
