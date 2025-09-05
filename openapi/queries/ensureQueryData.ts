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
export const ensureUseMeData = (queryClient: QueryClient, clientOptions: Options<MeData, true>) =>
  queryClient.ensureQueryData({
    queryKey: Common.UseMeKeyFn(clientOptions),
    queryFn: () => me({ ...clientOptions }).then((response) => response.data),
  });
export const ensureUseUserRankingData = (
  queryClient: QueryClient,
  clientOptions: Options<UserRankingData, true>,
) =>
  queryClient.ensureQueryData({
    queryKey: Common.UseUserRankingKeyFn(clientOptions),
    queryFn: () => userRanking({ ...clientOptions }).then((response) => response.data),
  });
export const ensureUseUserDetailData = (
  queryClient: QueryClient,
  clientOptions: Options<UserDetailData, true>,
) =>
  queryClient.ensureQueryData({
    queryKey: Common.UseUserDetailKeyFn(clientOptions),
    queryFn: () => userDetail({ ...clientOptions }).then((response) => response.data),
  });
export const ensureUseListUserCreatedProductsData = (
  queryClient: QueryClient,
  clientOptions: Options<ListUserCreatedProductsData, true>,
) =>
  queryClient.ensureQueryData({
    queryKey: Common.UseListUserCreatedProductsKeyFn(clientOptions),
    queryFn: () => listUserCreatedProducts({ ...clientOptions }).then((response) => response.data),
  });
export const ensureUseListUserReviewedProductsData = (
  queryClient: QueryClient,
  clientOptions: Options<ListUserReviewedProductsData, true>,
) =>
  queryClient.ensureQueryData({
    queryKey: Common.UseListUserReviewedProductsKeyFn(clientOptions),
    queryFn: () => listUserReviewedProducts({ ...clientOptions }).then((response) => response.data),
  });
export const ensureUseListUserFavoriteProductsData = (
  queryClient: QueryClient,
  clientOptions: Options<ListUserFavoriteProductsData, true>,
) =>
  queryClient.ensureQueryData({
    queryKey: Common.UseListUserFavoriteProductsKeyFn(clientOptions),
    queryFn: () => listUserFavoriteProducts({ ...clientOptions }).then((response) => response.data),
  });
export const ensureUseListUserFolloweesData = (
  queryClient: QueryClient,
  clientOptions: Options<ListUserFolloweesData, true>,
) =>
  queryClient.ensureQueryData({
    queryKey: Common.UseListUserFolloweesKeyFn(clientOptions),
    queryFn: () => listUserFollowees({ ...clientOptions }).then((response) => response.data),
  });
export const ensureUseListUserFollowersData = (
  queryClient: QueryClient,
  clientOptions: Options<ListUserFollowersData, true>,
) =>
  queryClient.ensureQueryData({
    queryKey: Common.UseListUserFollowersKeyFn(clientOptions),
    queryFn: () => listUserFollowers({ ...clientOptions }).then((response) => response.data),
  });
export const ensureUseListProductData = (
  queryClient: QueryClient,
  clientOptions: Options<ListProductData, true>,
) =>
  queryClient.ensureQueryData({
    queryKey: Common.UseListProductKeyFn(clientOptions),
    queryFn: () => listProduct({ ...clientOptions }).then((response) => response.data),
  });
export const ensureUseRetrieveProductData = (
  queryClient: QueryClient,
  clientOptions: Options<RetrieveProductData, true>,
) =>
  queryClient.ensureQueryData({
    queryKey: Common.UseRetrieveProductKeyFn(clientOptions),
    queryFn: () => retrieveProduct({ ...clientOptions }).then((response) => response.data),
  });
export const ensureUseListReviewsData = (
  queryClient: QueryClient,
  clientOptions: Options<ListReviewsData, true>,
) =>
  queryClient.ensureQueryData({
    queryKey: Common.UseListReviewsKeyFn(clientOptions),
    queryFn: () => listReviews({ ...clientOptions }).then((response) => response.data),
  });
export const ensureUseListAllCategoryData = (
  queryClient: QueryClient,
  clientOptions: Options<ListAllCategoryData, true>,
) =>
  queryClient.ensureQueryData({
    queryKey: Common.UseListAllCategoryKeyFn(clientOptions),
    queryFn: () => listAllCategory({ ...clientOptions }).then((response) => response.data),
  });
