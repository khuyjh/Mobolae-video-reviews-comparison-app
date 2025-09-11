export const renameFile = (file: File): File => {
  /* 확장자 추출 */
  const extension = file.name.split('.').pop()?.toLowerCase() || '';
  const safeExtension = extension.match(/^[a-z0-9]+$/i) ? extension : 'bin'; // 안전한 확장자만 허용
  const newFileName = `${crypto.randomUUID()}.${safeExtension}`; // UUID.확장자 형식으로 변환

  return new File([file], newFileName, { type: file.type });
};
