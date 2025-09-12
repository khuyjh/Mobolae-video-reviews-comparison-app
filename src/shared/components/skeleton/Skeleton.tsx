'use client';
import clsx from 'clsx';

type SkeletonProps = {
  className?: string;
  variant?: 'rect' | 'circle' | 'text';
};

const Skeleton = ({ className, variant = 'rect' }: SkeletonProps) => {
  const base = 'animate-pulse bg-black-700/60';
  const shape = { rect: 'rounded-md', circle: 'rounded-full', text: 'h-4 rounded' } as const;
  return <div className={clsx(base, shape[variant], className)} />;
};

export default Skeleton;
