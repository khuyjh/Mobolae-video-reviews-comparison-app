// 좋아요 + 카카오 공유 + 클립보드 복사
import { Heart } from 'lucide-react';
import React from 'react';

import KakaotalkIcon from '../../../../../public/icons/kakaotalk.svg';
import ShareIcon from '../../../../../public/icons/share.svg';

const ProductActions = () => {
  return (
    <div className='flex flex-col items-end gap-[10px]'>
      {/* 공유 버튼 그룹 */}
      <div className='flex gap-[10px]'>
        <button>
          <KakaotalkIcon />
        </button>
        <button>
          <ShareIcon />
        </button>
      </div>
      {/* 찜 버튼 */}
      <button>
        <Heart />
      </button>
    </div>
  );
};

export default ProductActions;
