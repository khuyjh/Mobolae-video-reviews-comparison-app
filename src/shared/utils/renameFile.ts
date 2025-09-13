/* tar.gz와 같은 다단계 확장자를 허용하는 경우 */
const ALLOWED_EXT_PATTERNS = [
  /^(jpg|jpeg|png|gif|pdf|txt|heic|webp)$/, // 단일 확장자
  /^tar\.gz$/, // 다단계 확장자
];

export const renameFile = (file: File): File => {
  // 전체 확장자 문자열 가져오기
  const fullExt = file.name.slice(file.name.lastIndexOf('.') + 1);

  // 화이트리스트 패턴을 순회하며 일치하는지 확인
  const isAllowed = ALLOWED_EXT_PATTERNS.some((pattern) => pattern.test(fullExt.toLowerCase()));
  const safeExtension = isAllowed ? fullExt : 'bin';

  const newFileName = `${crypto.randomUUID()}.${safeExtension}`;
  return new File([file], newFileName, { type: file.type });
};
