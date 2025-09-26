type LoaderProps = {
  src: string;
  width: number;
  quality?: number;
};

/**
 * wsrv.nl 로더
 * 모든 next/image 최적화 요청을 wsrv.nl 로 전달
 * 자동 webp 변환 + 품질 조정
 */
export default function wsrvLoader({ src, width, quality }: LoaderProps): string {
  const q = quality || 75;

  // 로컬 public 폴더 이미지 → wsrv.nl 안 거치고 그대로 사용
  if (src.startsWith('/')) {
    return src;
  }

  return `https://wsrv.nl/?url=${encodeURIComponent(src)}&w=${width}&q=${q}&output=webp`;
}
