import Cookies from 'js-cookie';

export const setCookie = (key: string, value: string) => {
  Cookies.set(key, value, {
    secure: true, // 배포 환경에서 작동 확인
    sameSite: 'Strict',
  });
};

export const getCookie = (key: string) => {
  return Cookies.get(key);
};

export const removeCookie = (key: string) => {
  Cookies.remove(key);
};
