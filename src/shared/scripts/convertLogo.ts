import path from 'path';

import sharp from 'sharp';

const convert = async () => {
  try {
    // 입력 파일 (원본 PNG)
    const inputPath = path.resolve('public/icons/LogoIcon.png');
    // 출력 파일 (최적화 WebP)
    const outputPath = path.resolve('public/icons/LogoIcon-48.webp');

    await sharp(inputPath)
      .resize(48, 48, {
        fit: 'inside', // 원본 비율 유지
        withoutEnlargement: true,
      })
      .webp({ quality: 75 }) // WebP 변환
      .toFile(outputPath);

    console.log('변환 성공:', outputPath);
  } catch (err) {
    console.error('변환 실패:', err);
  }
};

convert();
