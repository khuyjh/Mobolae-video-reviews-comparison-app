import Image from 'next/image';

interface ReviewDescriptionProps {
  reviewContent: string;
  Images?: string[];
}

const TEXT_STYLE = `
  text-xs-regular xl:text-base-regular leading-[16px] whitespace-pre-wrap text-white xl:leading-[22px]
`;

const IMAGE_LIST_STYLE = `
  mt-[20px] flex space-x-[10px] overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none]
  xl:space-x-[20px] [&::-webkit-scrollbar]:hidden
`;

const IMAGE_WRAPPER_STYLE = `
  relative h-[60px] w-[60px] flex-shrink-0 rounded-md
  md:h-[80px] md:w-[80px] xl:h-[100px] xl:w-[100px]
`;

const ReviewDescription = ({ reviewContent, Images }: ReviewDescriptionProps) => {
  return (
    <div>
      <p className={TEXT_STYLE}>{reviewContent}</p>
      {Images && Images.length > 0 && (
        <div className={IMAGE_LIST_STYLE}>
          {Images.map((imageSrc, index) => (
            <div key={imageSrc} className={IMAGE_WRAPPER_STYLE}>
              <Image
                src={imageSrc}
                alt={`리뷰에 첨부된 이미지 ${index + 1}`}
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
