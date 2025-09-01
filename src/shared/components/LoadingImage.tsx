import LoadingIcon from '../../../public/icons/LoadingIcon.svg';

interface Props {
  loadingText: string;
}

const LoadingImage = ({ loadingText }: Props) => {
  return (
    <div className='text-xl-regular flex h-21 flex-col items-center justify-between text-gray-600'>
      <LoadingIcon />
      <div>
        {loadingText.split('').map((letter, i) => (
          <span
            className='bounce-delay inline-block'
            key={i}
            style={{ animationDelay: `${i * 100}ms` }}
          >
            {letter}
          </span>
        ))}
      </div>
    </div>
  );
};

export default LoadingImage;
