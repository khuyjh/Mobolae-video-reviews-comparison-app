import { KAKAO_JS_KEY } from '../constants/constants';

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

/* SDK를 버튼 클릭 시 동적으로 로드 */
function loadKakaoSDK(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') return resolve();
    if (window.Kakao && window.Kakao.isInitialized()) return resolve();

    const script = document.createElement('script');
    script.src = 'https://developers.kakao.com/sdk/js/kakao.js';
    script.async = true;
    script.onload = () => {
      if (window.Kakao && !window.Kakao.isInitialized()) {
        window.Kakao.init(KAKAO_JS_KEY);
      }
      resolve();
    };
    script.onerror = () => reject();
    document.body.appendChild(script);
  });
}

export async function shareToKakao({
  title,
  description,
  imageUrl,
  url,
}: {
  title: string;
  description: string;
  imageUrl: string;
  url: string;
}) {
  try {
    await loadKakaoSDK(); // SDK 로드 후 실행
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
  } catch (err) {
    console.error('카카오톡 공유 실패:', err);
  }
}
