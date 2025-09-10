import { KAKAO_APP_KEY } from '@/shared/constants/constants';

declare global {
  interface Window {
    Kakao: {
      isInitialized: () => boolean;
      init: (key: string) => void;
      Share: {
        sendDefault: (params: Record<string, unknown>) => void;
      };
    };
  }
}

/* SDK 초기화 */
export function initKakao(): void {
  if (typeof window === 'undefined') return;
  if (!window.Kakao) return;
  if (!window.Kakao.isInitialized()) {
    window.Kakao.init(KAKAO_APP_KEY);
  }
}

/* 카카오톡 공유하기 */
export function shareToKakao({
  title,
  description,
  imageUrl,
  url,
}: {
  title: string;
  description: string;
  imageUrl: string;
  url: string;
}): void {
  if (typeof window === 'undefined' || !window.Kakao) return;

  initKakao();

  window.Kakao.Share.sendDefault({
    objectType: 'feed',
    content: {
      title,
      description,
      imageUrl,
      link: {
        mobileWebUrl: url,
        webUrl: url,
      },
    },
    buttons: [
      {
        title: '자세히 보기',
        link: {
          mobileWebUrl: url,
          webUrl: url,
        },
      },
    ],
  });
}
