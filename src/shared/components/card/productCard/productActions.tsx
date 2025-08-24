// 좋아요 + 카카오 공유 + 클립보드 복사
import { Heart } from 'lucide-react';
import React from 'react';

import KakaotalkIcon from '../../../../../public/icons/kakaotalk.svg';
import ShareIcon from '../../../../../public/icons/share.svg';

const ProductActions = () => {
  return (
    <div>
      <div>
        <button>
          <KakaotalkIcon />
        </button>
        <button>
          <ShareIcon />
        </button>
      </div>

      <button>
        <Heart />
      </button>
    </div>
  );
};

export default ProductActions;
