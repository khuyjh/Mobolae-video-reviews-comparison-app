// generated with @7nohe/openapi-react-query-codegen@2.0.0-beta.3

import { type Options } from '@hey-api/client-axios';
import { type QueryClient } from '@tanstack/react-query';

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
  ListProductData,
  ListReviewsData,
  ListUserCreatedProductsData,
  ListUserFavoriteProductsData,
  ListUserFolloweesData,
  ListUserFollowersData,
  ListUserReviewedProductsData,
  MeData,
  RetrieveProductData,
  UserDetailData,
  UserRankingData,
} from '../requests/types.gen';
export const prefetchUseMe = (queryClient: QueryClient, clientOptions: Options<MeData, true>) =>
  queryClient.prefetchQuery({
    queryKey: Common.UseMeKeyFn(clientOptions),
    queryFn: () => me({ ...clientOptions }).then((response) => response.data),
  });
export const prefetchUseUserRanking = (
  queryClient: QueryClient,
  clientOptions: Options<UserRankingData, true>,
) =>
  queryClient.prefetchQuery({
    queryKey: Common.UseUserRankingKeyFn(clientOptions),
    queryFn: () => userRanking({ ...clientOptions }).then((response) => response.data),
  });
export const prefetchUseUserDetail = (
  queryClient: QueryClient,
  clientOptions: Options<UserDetailData, true>,
) =>
  queryClient.prefetchQuery({
    queryKey: Common.UseUserDetailKeyFn(clientOptions),
    queryFn: () => userDetail({ ...clientOptions }).then((response) => response.data),
  });
export const prefetchUseListUserCreatedProducts = (
  queryClient: QueryClient,
  clientOptions: Options<ListUserCreatedProductsData, true>,
) =>
  queryClient.prefetchQuery({
    queryKey: Common.UseListUserCreatedProductsKeyFn(clientOptions),
    queryFn: () => listUserCreatedProducts({ ...clientOptions }).then((response) => response.data),
  });
export const prefetchUseListUserReviewedProducts = (
  queryClient: QueryClient,
  clientOptions: Options<ListUserReviewedProductsData, true>,
) =>
  queryClient.prefetchQuery({
    queryKey: Common.UseListUserReviewedProductsKeyFn(clientOptions),
    queryFn: () => listUserReviewedProducts({ ...clientOptions }).then((response) => response.data),
  });
export const prefetchUseListUserFavoriteProducts = (
  queryClient: QueryClient,
  clientOptions: Options<ListUserFavoriteProductsData, true>,
) =>
  queryClient.prefetchQuery({
    queryKey: Common.UseListUserFavoriteProductsKeyFn(clientOptions),
    queryFn: () => listUserFavoriteProducts({ ...clientOptions }).then((response) => response.data),
  });
export const prefetchUseListUserFollowees = (
  queryClient: QueryClient,
  clientOptions: Options<ListUserFolloweesData, true>,
) =>
  queryClient.prefetchQuery({
    queryKey: Common.UseListUserFolloweesKeyFn(clientOptions),
    queryFn: () => listUserFollowees({ ...clientOptions }).then((response) => response.data),
  });
export const prefetchUseListUserFollowers = (
  queryClient: QueryClient,
  clientOptions: Options<ListUserFollowersData, true>,
) =>
  queryClient.prefetchQuery({
    queryKey: Common.UseListUserFollowersKeyFn(clientOptions),
    queryFn: () => listUserFollowers({ ...clientOptions }).then((response) => response.data),
  });
export const prefetchUseListProduct = (
  queryClient: QueryClient,
  clientOptions: Options<ListProductData, true>,
) =>
  queryClient.prefetchQuery({
    queryKey: Common.UseListProductKeyFn(clientOptions),
    queryFn: () => listProduct({ ...clientOptions }).then((response) => response.data),
  });
export const prefetchUseRetrieveProduct = (
  queryClient: QueryClient,
  clientOptions: Options<RetrieveProductData, true>,
) =>
  queryClient.prefetchQuery({
    queryKey: Common.UseRetrieveProductKeyFn(clientOptions),
    queryFn: () => retrieveProduct({ ...clientOptions }).then((response) => response.data),
  });
export const prefetchUseListReviews = (
  queryClient: QueryClient,
  clientOptions: Options<ListReviewsData, true>,
) =>
  queryClient.prefetchQuery({
    queryKey: Common.UseListReviewsKeyFn(clientOptions),
    queryFn: () => listReviews({ ...clientOptions }).then((response) => response.data),
  });
export const prefetchUseListAllCategory = (
  queryClient: QueryClient,
  clientOptions: Options<ListAllCategoryData, true>,
) =>
  queryClient.prefetchQuery({
    queryKey: Common.UseListAllCategoryKeyFn(clientOptions),
    queryFn: () => listAllCategory({ ...clientOptions }).then((response) => response.data),
  });
