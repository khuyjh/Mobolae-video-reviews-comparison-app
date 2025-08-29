'use client';

import { motion } from 'framer-motion';

import LoadingIcon from '../../../public/icons/LoadingIcon.svg';

const LOADING_TEXT = 'Loading...';

const LoadingImage = () => {
  return (
    <div className='text-xl-regular flex h-21 flex-col items-center justify-between text-gray-600'>
      <LoadingIcon />
      <div>
        {LOADING_TEXT.split('').map((letter, i) => (
          <motion.span
            className='inline-block'
            key={i}
            animate={{ y: [0, -3, 0] }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.1,
              repeatDelay: 1,
            }}
          >
            {letter}
          </motion.span>
        ))}
      </div>
    </div>
  );
};

export default LoadingImage;
