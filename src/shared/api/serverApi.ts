import { cookies } from 'next/headers';

//fetch api 헤더에 토큰부여
const serverFetch = async (endpoint: string, options?: RequestInit) => {
  const accessToken = (await cookies()).get('accessToken')?.value;

  //option에 header key가 있다면 추가
  const headers = new Headers(options?.headers);
  headers.set('Content-Type', 'application/json');

  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error('Fetch API 요청 실패');
  }

  return response.json();
};

//토큰부여 함수를 호출하는 fetch api instance
const serverApi = {
  get: (endpoint: string, options?: RequestInit) => {
    return serverFetch(endpoint, {
      method: 'GET',
      ...options,
    });
  },
  post: <T>(endpoint: string, body: T, options?: RequestInit) => {
    return serverFetch(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
      ...options,
    });
  },
  patch: <T>(endpoint: string, body: T, options?: RequestInit) => {
    return serverFetch(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(body),
      ...options,
    });
  },
  delete: (endpoint: string, options?: RequestInit) => {
    return serverFetch(endpoint, {
      method: 'DELETE',
      ...options,
    });
  },
};

export default serverApi;
