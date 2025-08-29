import Image from 'next/image';

interface ReviewDescriptionProps {
  reviewContent: string;
  Images?: string[];
}

const ReviewDescription = ({ reviewContent, Images }: ReviewDescriptionProps) => {
  return (
    <div>
      <p className='text-xs-regular xl:text-base-regular leading-[16px] whitespace-pre-wrap text-white xl:leading-[22px]'>
        {reviewContent}
      </p>
      {Images && Images.length > 0 && (
        <div className='mt-[20px] flex space-x-[10px] overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] xl:space-x-[20px] [&::-webkit-scrollbar]:hidden'>
          {Images.map((imageSrc, index) => (
            <div
              key={index}
              className='relative h-[60px] w-[60px] flex-shrink-0 rounded-md md:h-[80px] md:w-[80px] xl:h-[100px] xl:w-[100px]'
            >
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
