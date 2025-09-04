// generated with @7nohe/openapi-react-query-codegen@2.0.0-beta.3

import { type Options } from '@hey-api/client-axios';
import { UseQueryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import * as Common from './common';
import {
  listAllCategory,
  listProduct,
  listReviews,
  listUserCreatedProducts,
  listUserFavoriteProducts,
  listUserFollowees,
  listUserFollowers,
  listUserReviewedProducts,
  me,
  retrieveProduct,
  userDetail,
  userRanking,
} from '../requests/services.gen';
import {
  ListAllCategoryData,
  ListAllCategoryError,
  ListProductData,
  ListProductError,
  ListReviewsData,
  ListReviewsError,
  ListUserCreatedProductsData,
  ListUserCreatedProductsError,
  ListUserFavoriteProductsData,
  ListUserFavoriteProductsError,
  ListUserFolloweesData,
  ListUserFolloweesError,
  ListUserFollowersData,
  ListUserFollowersError,
  ListUserReviewedProductsData,
  ListUserReviewedProductsError,
  MeData,
  MeError,
  RetrieveProductData,
  RetrieveProductError,
  UserDetailData,
  UserDetailError,
  UserRankingData,
  UserRankingError,
} from '../requests/types.gen';
export const useMeSuspense = <
  TData = Common.MeDefaultResponse,
  TError = AxiosError<MeError>,
  TQueryKey extends Array<unknown> = unknown[],
>(
  clientOptions: Options<MeData, true>,
  queryKey?: TQueryKey,
  options?: Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'>,
) =>
  useSuspenseQuery<TData, TError>({
    queryKey: Common.UseMeKeyFn(clientOptions, queryKey),
    queryFn: () => me({ ...clientOptions }).then((response) => response.data as TData) as TData,
    ...options,
  });
export const useUserRankingSuspense = <
  TData = Common.UserRankingDefaultResponse,
  TError = AxiosError<UserRankingError>,
  TQueryKey extends Array<unknown> = unknown[],
>(
  clientOptions: Options<UserRankingData, true>,
  queryKey?: TQueryKey,
  options?: Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'>,
) =>
  useSuspenseQuery<TData, TError>({
    queryKey: Common.UseUserRankingKeyFn(clientOptions, queryKey),
    queryFn: () =>
      userRanking({ ...clientOptions }).then((response) => response.data as TData) as TData,
    ...options,
  });
export const useUserDetailSuspense = <
  TData = Common.UserDetailDefaultResponse,
  TError = AxiosError<UserDetailError>,
  TQueryKey extends Array<unknown> = unknown[],
>(
  clientOptions: Options<UserDetailData, true>,
  queryKey?: TQueryKey,
  options?: Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'>,
) =>
  useSuspenseQuery<TData, TError>({
    queryKey: Common.UseUserDetailKeyFn(clientOptions, queryKey),
    queryFn: () =>
      userDetail({ ...clientOptions }).then((response) => response.data as TData) as TData,
    ...options,
  });
export const useListUserCreatedProductsSuspense = <
  TData = Common.ListUserCreatedProductsDefaultResponse,
  TError = AxiosError<ListUserCreatedProductsError>,
  TQueryKey extends Array<unknown> = unknown[],
>(
  clientOptions: Options<ListUserCreatedProductsData, true>,
  queryKey?: TQueryKey,
  options?: Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'>,
) =>
  useSuspenseQuery<TData, TError>({
    queryKey: Common.UseListUserCreatedProductsKeyFn(clientOptions, queryKey),
    queryFn: () =>
      listUserCreatedProducts({ ...clientOptions }).then(
        (response) => response.data as TData,
      ) as TData,
    ...options,
  });
export const useListUserReviewedProductsSuspense = <
  TData = Common.ListUserReviewedProductsDefaultResponse,
  TError = AxiosError<ListUserReviewedProductsError>,
  TQueryKey extends Array<unknown> = unknown[],
>(
  clientOptions: Options<ListUserReviewedProductsData, true>,
  queryKey?: TQueryKey,
  options?: Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'>,
) =>
  useSuspenseQuery<TData, TError>({
    queryKey: Common.UseListUserReviewedProductsKeyFn(clientOptions, queryKey),
    queryFn: () =>
      listUserReviewedProducts({ ...clientOptions }).then(
        (response) => response.data as TData,
      ) as TData,
    ...options,
  });
export const useListUserFavoriteProductsSuspense = <
  TData = Common.ListUserFavoriteProductsDefaultResponse,
  TError = AxiosError<ListUserFavoriteProductsError>,
  TQueryKey extends Array<unknown> = unknown[],
>(
  clientOptions: Options<ListUserFavoriteProductsData, true>,
  queryKey?: TQueryKey,
  options?: Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'>,
) =>
  useSuspenseQuery<TData, TError>({
    queryKey: Common.UseListUserFavoriteProductsKeyFn(clientOptions, queryKey),
    queryFn: () =>
      listUserFavoriteProducts({ ...clientOptions }).then(
        (response) => response.data as TData,
      ) as TData,
    ...options,
  });
export const useListUserFolloweesSuspense = <
  TData = Common.ListUserFolloweesDefaultResponse,
  TError = AxiosError<ListUserFolloweesError>,
  TQueryKey extends Array<unknown> = unknown[],
>(
  clientOptions: Options<ListUserFolloweesData, true>,
  queryKey?: TQueryKey,
  options?: Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'>,
) =>
  useSuspenseQuery<TData, TError>({
    queryKey: Common.UseListUserFolloweesKeyFn(clientOptions, queryKey),
    queryFn: () =>
      listUserFollowees({ ...clientOptions }).then((response) => response.data as TData) as TData,
    ...options,
  });
export const useListUserFollowersSuspense = <
  TData = Common.ListUserFollowersDefaultResponse,
  TError = AxiosError<ListUserFollowersError>,
  TQueryKey extends Array<unknown> = unknown[],
>(
  clientOptions: Options<ListUserFollowersData, true>,
  queryKey?: TQueryKey,
  options?: Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'>,
) =>
  useSuspenseQuery<TData, TError>({
    queryKey: Common.UseListUserFollowersKeyFn(clientOptions, queryKey),
    queryFn: () =>
      listUserFollowers({ ...clientOptions }).then((response) => response.data as TData) as TData,
    ...options,
  });
export const useListProductSuspense = <
  TData = Common.ListProductDefaultResponse,
  TError = AxiosError<ListProductError>,
  TQueryKey extends Array<unknown> = unknown[],
>(
  clientOptions: Options<ListProductData, true>,
  queryKey?: TQueryKey,
  options?: Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'>,
) =>
  useSuspenseQuery<TData, TError>({
    queryKey: Common.UseListProductKeyFn(clientOptions, queryKey),
    queryFn: () =>
      listProduct({ ...clientOptions }).then((response) => response.data as TData) as TData,
    ...options,
  });
export const useRetrieveProductSuspense = <
  TData = Common.RetrieveProductDefaultResponse,
  TError = AxiosError<RetrieveProductError>,
  TQueryKey extends Array<unknown> = unknown[],
>(
  clientOptions: Options<RetrieveProductData, true>,
  queryKey?: TQueryKey,
  options?: Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'>,
) =>
  useSuspenseQuery<TData, TError>({
    queryKey: Common.UseRetrieveProductKeyFn(clientOptions, queryKey),
    queryFn: () =>
      retrieveProduct({ ...clientOptions }).then((response) => response.data as TData) as TData,
    ...options,
  });
export const useListReviewsSuspense = <
  TData = Common.ListReviewsDefaultResponse,
  TError = AxiosError<ListReviewsError>,
  TQueryKey extends Array<unknown> = unknown[],
>(
  clientOptions: Options<ListReviewsData, true>,
  queryKey?: TQueryKey,
  options?: Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'>,
) =>
  useSuspenseQuery<TData, TError>({
    queryKey: Common.UseListReviewsKeyFn(clientOptions, queryKey),
    queryFn: () =>
      listReviews({ ...clientOptions }).then((response) => response.data as TData) as TData,
    ...options,
  });
export const useListAllCategorySuspense = <
  TData = Common.ListAllCategoryDefaultResponse,
  TError = AxiosError<ListAllCategoryError>,
  TQueryKey extends Array<unknown> = unknown[],
>(
  clientOptions: Options<ListAllCategoryData, true>,
  queryKey?: TQueryKey,
  options?: Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'>,
) =>
  useSuspenseQuery<TData, TError>({
    queryKey: Common.UseListAllCategoryKeyFn(clientOptions, queryKey),
    queryFn: () =>
      listAllCategory({ ...clientOptions }).then((response) => response.data as TData) as TData,
    ...options,
  });
