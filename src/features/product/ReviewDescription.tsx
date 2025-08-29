//설명

import Image from 'next/image';

interface ReviewDescriptionProps {
  reviewContent: string;
  reviewImages?: string[];
}

const ReviewDescription = ({ reviewContent, reviewImages }: ReviewDescriptionProps) => {
  return (
    <div>
      <p className='whitespace-pre-wrap text-gray-300'>{reviewContent}</p>
      {reviewImages && reviewImages.length > 0 && (
        <div className='mt-4 flex space-x-2 overflow-x-auto'>
          {reviewImages.map((image, index) => (
            <div key={index} className='relative h-20 w-20 flex-shrink-0'>
              <Image
                src={image}
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
