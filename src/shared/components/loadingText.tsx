'use client';

type LoadingTextProps = {
  text?: string;
  className?: string;
};

export default function LoadingText({ text = 'Loading...', className }: LoadingTextProps) {
  return (
    <div
      className={`text-xl-regular inline-flex h-21 flex-row items-center justify-between gap-0 text-white ${className}`}
    >
      {text.split('').map((letter, i) => (
        <span
          key={i}
          className='bounce-delay inline-block'
          style={{ animationDelay: `${i * 100}ms` }}
        >
          {letter}
        </span>
      ))}
    </div>
  );
}
