import { useInfiniteQuery } from '@tanstack/react-query';

import { client } from '../requests/services.gen';

export interface InfiniteApiResponse<T> {
  nextCursor: number | null;
  list: T[];
}

/* API 호출 시 전달할 파라미터 타입  */
export type QueryValue = string | number | boolean | null | undefined;
export type PathParams = Record<string, string | number>;
export type QueryParams = Record<string, QueryValue>;
export interface Params {
  path?: PathParams;
  query?: QueryParams;
}

export interface SelectedInfiniteData<T> {
  pages: Array<InfiniteApiResponse<T>>;
  pageParams: unknown[];
  items: T[]; // 모든 페이지 데이터를 평탄화
}

/* URL 경로 안에 param을 실제 값으로 치환 */
function replacePathParams(url: string, path?: PathParams): string {
  if (!path) return url;
  return Object.entries(path).reduce(
    (acc, [k, v]) => acc.replace(`{${k}}`, encodeURIComponent(String(v))),
    url,
  );
}

/* QueryParams -> query string */
function buildSearchParams(query?: QueryParams): string {
  if (!query) return '';
  const sp = new URLSearchParams();
  Object.entries(query).forEach(([k, v]) => {
    if (v !== undefined && v !== null) sp.set(k, String(v));
  });
  return sp.toString();
}

/* 공용 무한스크롤 훅
 * 초기 데이터(initialDate)를 넘기면 SSR에서도 활용 가능
 */
export function useInfiniteApi<T>(
  queryKey: ReadonlyArray<string | number>,
  url: string,
  params?: Params,
  initialData?: InfiniteApiResponse<T>,
) {
  return useInfiniteQuery<
    InfiniteApiResponse<T>,
    Error,
    SelectedInfiniteData<T>,
    readonly (string | number)[],
    number | null
  >({
    queryKey,
    queryFn: async ({ pageParam }: { pageParam: number | null }) => {
      /* path 치환 */
      const endpoint = replacePathParams(url, params?.path);

      /* query string 생성 */
      const query: QueryParams = {
        ...(params?.query ?? {}),
        ...(pageParam !== null ? { cursor: pageParam } : {}),
      };

      const qs = buildSearchParams(query);
      const finalUrl = qs ? `${endpoint}?${qs}` : endpoint;

      const res = await client.get<InfiniteApiResponse<T>, unknown, true>({ url: finalUrl });

      return res.data;
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? null,
    initialPageParam: null,
    initialData: initialData
      ? {
          pages: [initialData],
          pageParams: [null],
        }
      : undefined,
    select: (data) => ({
      pages: data.pages,
      pageParams: data.pageParams,
      items: data.pages.flatMap((p) => p.list),
    }),
  });
}
