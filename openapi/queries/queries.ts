// generated with @7nohe/openapi-react-query-codegen@2.0.0-beta.3

import { type Options } from '@hey-api/client-axios';
import { useMutation, UseMutationOptions, useQuery, UseQueryOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import * as Common from './common';
import {
  createProduct,
  createReview,
  deleteProduct,
  deleteReview,
  favorite,
  follow,
  imageUpload,
  likeReview,
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
  signIn,
  signInOauth,
  signUp,
  signUpOauth,
  unfavorite,
  unfollow,
  unlikeReview,
  updateMe,
  updateProduct,
  updateReview,
  upsertOauthApp,
  userDetail,
  userRanking,
} from '../requests/services.gen';
import {
  CreateProductData,
  CreateProductError,
  CreateReviewData,
  CreateReviewError,
  DeleteProductData,
  DeleteProductError,
  DeleteReviewData,
  DeleteReviewError,
  FavoriteData,
  FavoriteError,
  FollowData,
  FollowError,
  ImageUploadData,
  ImageUploadError,
  LikeReviewData,
  LikeReviewError,
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
  SignInData,
  SignInError,
  SignInOauthData,
  SignInOauthError,
  SignUpData,
  SignUpError,
  SignUpOauthData,
  SignUpOauthError,
  UnfavoriteData,
  UnfavoriteError,
  UnfollowData,
  UnfollowError,
  UnlikeReviewData,
  UnlikeReviewError,
  UpdateMeData,
  UpdateMeError,
  UpdateProductData,
  UpdateProductError,
  UpdateReviewData,
  UpdateReviewError,
  UpsertOauthAppData,
  UpsertOauthAppError,
  UserDetailData,
  UserDetailError,
  UserRankingData,
  UserRankingError,
} from '../requests/types.gen';
export const useMe = <
  TData = Common.MeDefaultResponse,
  TError = AxiosError<MeError>,
  TQueryKey extends Array<unknown> = unknown[],
>(
  clientOptions: Options<MeData, true>,
  queryKey?: TQueryKey,
  options?: Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'>,
) =>
  useQuery<TData, TError>({
    queryKey: Common.UseMeKeyFn(clientOptions, queryKey),
    queryFn: () => me({ ...clientOptions }).then((response) => response.data as TData) as TData,
    ...options,
  });
export const useUserRanking = <
  TData = Common.UserRankingDefaultResponse,
  TError = AxiosError<UserRankingError>,
  TQueryKey extends Array<unknown> = unknown[],
>(
  clientOptions: Options<UserRankingData, true>,
  queryKey?: TQueryKey,
  options?: Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'>,
) =>
  useQuery<TData, TError>({
    queryKey: Common.UseUserRankingKeyFn(clientOptions, queryKey),
    queryFn: () =>
      userRanking({ ...clientOptions }).then((response) => response.data as TData) as TData,
    ...options,
  });
export const useUserDetail = <
  TData = Common.UserDetailDefaultResponse,
  TError = AxiosError<UserDetailError>,
  TQueryKey extends Array<unknown> = unknown[],
>(
  clientOptions: Options<UserDetailData, true>,
  queryKey?: TQueryKey,
  options?: Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'>,
) =>
  useQuery<TData, TError>({
    queryKey: Common.UseUserDetailKeyFn(clientOptions, queryKey),
    queryFn: () =>
      userDetail({ ...clientOptions }).then((response) => response.data as TData) as TData,
    ...options,
  });
export const useListUserCreatedProducts = <
  TData = Common.ListUserCreatedProductsDefaultResponse,
  TError = AxiosError<ListUserCreatedProductsError>,
  TQueryKey extends Array<unknown> = unknown[],
>(
  clientOptions: Options<ListUserCreatedProductsData, true>,
  queryKey?: TQueryKey,
  options?: Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'>,
) =>
  useQuery<TData, TError>({
    queryKey: Common.UseListUserCreatedProductsKeyFn(clientOptions, queryKey),
    queryFn: () =>
      listUserCreatedProducts({ ...clientOptions }).then(
        (response) => response.data as TData,
      ) as TData,
    ...options,
  });
export const useListUserReviewedProducts = <
  TData = Common.ListUserReviewedProductsDefaultResponse,
  TError = AxiosError<ListUserReviewedProductsError>,
  TQueryKey extends Array<unknown> = unknown[],
>(
  clientOptions: Options<ListUserReviewedProductsData, true>,
  queryKey?: TQueryKey,
  options?: Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'>,
) =>
  useQuery<TData, TError>({
    queryKey: Common.UseListUserReviewedProductsKeyFn(clientOptions, queryKey),
    queryFn: () =>
      listUserReviewedProducts({ ...clientOptions }).then(
        (response) => response.data as TData,
      ) as TData,
    ...options,
  });
export const useListUserFavoriteProducts = <
  TData = Common.ListUserFavoriteProductsDefaultResponse,
  TError = AxiosError<ListUserFavoriteProductsError>,
  TQueryKey extends Array<unknown> = unknown[],
>(
  clientOptions: Options<ListUserFavoriteProductsData, true>,
  queryKey?: TQueryKey,
  options?: Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'>,
) =>
  useQuery<TData, TError>({
    queryKey: Common.UseListUserFavoriteProductsKeyFn(clientOptions, queryKey),
    queryFn: () =>
      listUserFavoriteProducts({ ...clientOptions }).then(
        (response) => response.data as TData,
      ) as TData,
    ...options,
  });
export const useListUserFollowees = <
  TData = Common.ListUserFolloweesDefaultResponse,
  TError = AxiosError<ListUserFolloweesError>,
  TQueryKey extends Array<unknown> = unknown[],
>(
  clientOptions: Options<ListUserFolloweesData, true>,
  queryKey?: TQueryKey,
  options?: Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'>,
) =>
  useQuery<TData, TError>({
    queryKey: Common.UseListUserFolloweesKeyFn(clientOptions, queryKey),
    queryFn: () =>
      listUserFollowees({ ...clientOptions }).then((response) => response.data as TData) as TData,
    ...options,
  });
export const useListUserFollowers = <
  TData = Common.ListUserFollowersDefaultResponse,
  TError = AxiosError<ListUserFollowersError>,
  TQueryKey extends Array<unknown> = unknown[],
>(
  clientOptions: Options<ListUserFollowersData, true>,
  queryKey?: TQueryKey,
  options?: Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'>,
) =>
  useQuery<TData, TError>({
    queryKey: Common.UseListUserFollowersKeyFn(clientOptions, queryKey),
    queryFn: () =>
      listUserFollowers({ ...clientOptions }).then((response) => response.data as TData) as TData,
    ...options,
  });
export const useListProduct = <
  TData = Common.ListProductDefaultResponse,
  TError = AxiosError<ListProductError>,
  TQueryKey extends Array<unknown> = unknown[],
>(
  clientOptions: Options<ListProductData, true>,
  queryKey?: TQueryKey,
  options?: Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'>,
) =>
  useQuery<TData, TError>({
    queryKey: Common.UseListProductKeyFn(clientOptions, queryKey),
    queryFn: () =>
      listProduct({ ...clientOptions }).then((response) => response.data as TData) as TData,
    ...options,
  });
export const useRetrieveProduct = <
  TData = Common.RetrieveProductDefaultResponse,
  TError = AxiosError<RetrieveProductError>,
  TQueryKey extends Array<unknown> = unknown[],
>(
  clientOptions: Options<RetrieveProductData, true>,
  queryKey?: TQueryKey,
  options?: Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'>,
) =>
  useQuery<TData, TError>({
    queryKey: Common.UseRetrieveProductKeyFn(clientOptions, queryKey),
    queryFn: () =>
      retrieveProduct({ ...clientOptions }).then((response) => response.data as TData) as TData,
    ...options,
  });
export const useListReviews = <
  TData = Common.ListReviewsDefaultResponse,
  TError = AxiosError<ListReviewsError>,
  TQueryKey extends Array<unknown> = unknown[],
>(
  clientOptions: Options<ListReviewsData, true>,
  queryKey?: TQueryKey,
  options?: Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'>,
) =>
  useQuery<TData, TError>({
    queryKey: Common.UseListReviewsKeyFn(clientOptions, queryKey),
    queryFn: () =>
      listReviews({ ...clientOptions }).then((response) => response.data as TData) as TData,
    ...options,
  });
export const useListAllCategory = <
  TData = Common.ListAllCategoryDefaultResponse,
  TError = AxiosError<ListAllCategoryError>,
  TQueryKey extends Array<unknown> = unknown[],
>(
  clientOptions: Options<ListAllCategoryData, true>,
  queryKey?: TQueryKey,
  options?: Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'>,
) =>
  useQuery<TData, TError>({
    queryKey: Common.UseListAllCategoryKeyFn(clientOptions, queryKey),
    queryFn: () =>
      listAllCategory({ ...clientOptions }).then((response) => response.data as TData) as TData,
    ...options,
  });
export const useLikeReview = <
  TData = Common.LikeReviewMutationResult,
  TError = AxiosError<LikeReviewError>,
  TQueryKey extends Array<unknown> = unknown[],
  TContext = unknown,
>(
  mutationKey?: TQueryKey,
  options?: Omit<
    UseMutationOptions<TData, TError, Options<LikeReviewData, true>, TContext>,
    'mutationKey' | 'mutationFn'
  >,
) =>
  useMutation<TData, TError, Options<LikeReviewData, true>, TContext>({
    mutationKey: Common.UseLikeReviewKeyFn(mutationKey),
    mutationFn: (clientOptions) => likeReview(clientOptions) as unknown as Promise<TData>,
    ...options,
  });
export const useCreateReview = <
  TData = Common.CreateReviewMutationResult,
  TError = AxiosError<CreateReviewError>,
  TQueryKey extends Array<unknown> = unknown[],
  TContext = unknown,
>(
  mutationKey?: TQueryKey,
  options?: Omit<
    UseMutationOptions<TData, TError, Options<CreateReviewData, true>, TContext>,
    'mutationKey' | 'mutationFn'
  >,
) =>
  useMutation<TData, TError, Options<CreateReviewData, true>, TContext>({
    mutationKey: Common.UseCreateReviewKeyFn(mutationKey),
    mutationFn: (clientOptions) => createReview(clientOptions) as unknown as Promise<TData>,
    ...options,
  });
export const useCreateProduct = <
  TData = Common.CreateProductMutationResult,
  TError = AxiosError<CreateProductError>,
  TQueryKey extends Array<unknown> = unknown[],
  TContext = unknown,
>(
  mutationKey?: TQueryKey,
  options?: Omit<
    UseMutationOptions<TData, TError, Options<CreateProductData, true>, TContext>,
    'mutationKey' | 'mutationFn'
  >,
) =>
  useMutation<TData, TError, Options<CreateProductData, true>, TContext>({
    mutationKey: Common.UseCreateProductKeyFn(mutationKey),
    mutationFn: (clientOptions) => createProduct(clientOptions) as unknown as Promise<TData>,
    ...options,
  });
export const useUpsertOauthApp = <
  TData = Common.UpsertOauthAppMutationResult,
  TError = AxiosError<UpsertOauthAppError>,
  TQueryKey extends Array<unknown> = unknown[],
  TContext = unknown,
>(
  mutationKey?: TQueryKey,
  options?: Omit<
    UseMutationOptions<TData, TError, Options<UpsertOauthAppData, true>, TContext>,
    'mutationKey' | 'mutationFn'
  >,
) =>
  useMutation<TData, TError, Options<UpsertOauthAppData, true>, TContext>({
    mutationKey: Common.UseUpsertOauthAppKeyFn(mutationKey),
    mutationFn: (clientOptions) => upsertOauthApp(clientOptions) as unknown as Promise<TData>,
    ...options,
  });
export const useImageUpload = <
  TData = Common.ImageUploadMutationResult,
  TError = AxiosError<ImageUploadError>,
  TQueryKey extends Array<unknown> = unknown[],
  TContext = unknown,
>(
  mutationKey?: TQueryKey,
  options?: Omit<
    UseMutationOptions<TData, TError, Options<ImageUploadData, true>, TContext>,
    'mutationKey' | 'mutationFn'
  >,
) =>
  useMutation<TData, TError, Options<ImageUploadData, true>, TContext>({
    mutationKey: Common.UseImageUploadKeyFn(mutationKey),
    mutationFn: (clientOptions) => imageUpload(clientOptions) as unknown as Promise<TData>,
    ...options,
  });
export const useFollow = <
  TData = Common.FollowMutationResult,
  TError = AxiosError<FollowError>,
  TQueryKey extends Array<unknown> = unknown[],
  TContext = unknown,
>(
  mutationKey?: TQueryKey,
  options?: Omit<
    UseMutationOptions<TData, TError, Options<FollowData, true>, TContext>,
    'mutationKey' | 'mutationFn'
  >,
) =>
  useMutation<TData, TError, Options<FollowData, true>, TContext>({
    mutationKey: Common.UseFollowKeyFn(mutationKey),
    mutationFn: (clientOptions) => follow(clientOptions) as unknown as Promise<TData>,
    ...options,
  });
export const useFavorite = <
  TData = Common.FavoriteMutationResult,
  TError = AxiosError<FavoriteError>,
  TQueryKey extends Array<unknown> = unknown[],
  TContext = unknown,
>(
  mutationKey?: TQueryKey,
  options?: Omit<
    UseMutationOptions<TData, TError, Options<FavoriteData, true>, TContext>,
    'mutationKey' | 'mutationFn'
  >,
) =>
  useMutation<TData, TError, Options<FavoriteData, true>, TContext>({
    mutationKey: Common.UseFavoriteKeyFn(mutationKey),
    mutationFn: (clientOptions) => favorite(clientOptions) as unknown as Promise<TData>,
    ...options,
  });
export const useSignUp = <
  TData = Common.SignUpMutationResult,
  TError = AxiosError<SignUpError>,
  TQueryKey extends Array<unknown> = unknown[],
  TContext = unknown,
>(
  mutationKey?: TQueryKey,
  options?: Omit<
    UseMutationOptions<TData, TError, Options<SignUpData, true>, TContext>,
    'mutationKey' | 'mutationFn'
  >,
) =>
  useMutation<TData, TError, Options<SignUpData, true>, TContext>({
    mutationKey: Common.UseSignUpKeyFn(mutationKey),
    mutationFn: (clientOptions) => signUp(clientOptions) as unknown as Promise<TData>,
    ...options,
  });
export const useSignIn = <
  TData = Common.SignInMutationResult,
  TError = AxiosError<SignInError>,
  TQueryKey extends Array<unknown> = unknown[],
  TContext = unknown,
>(
  mutationKey?: TQueryKey,
  options?: Omit<
    UseMutationOptions<TData, TError, Options<SignInData, true>, TContext>,
    'mutationKey' | 'mutationFn'
  >,
) =>
  useMutation<TData, TError, Options<SignInData, true>, TContext>({
    mutationKey: Common.UseSignInKeyFn(mutationKey),
    mutationFn: (clientOptions) => signIn(clientOptions) as unknown as Promise<TData>,
    ...options,
  });
export const useSignUpOauth = <
  TData = Common.SignUpOauthMutationResult,
  TError = AxiosError<SignUpOauthError>,
  TQueryKey extends Array<unknown> = unknown[],
  TContext = unknown,
>(
  mutationKey?: TQueryKey,
  options?: Omit<
    UseMutationOptions<TData, TError, Options<SignUpOauthData, true>, TContext>,
    'mutationKey' | 'mutationFn'
  >,
) =>
  useMutation<TData, TError, Options<SignUpOauthData, true>, TContext>({
    mutationKey: Common.UseSignUpOauthKeyFn(mutationKey),
    mutationFn: (clientOptions) => signUpOauth(clientOptions) as unknown as Promise<TData>,
    ...options,
  });
export const useSignInOauth = <
  TData = Common.SignInOauthMutationResult,
  TError = AxiosError<SignInOauthError>,
  TQueryKey extends Array<unknown> = unknown[],
  TContext = unknown,
>(
  mutationKey?: TQueryKey,
  options?: Omit<
    UseMutationOptions<TData, TError, Options<SignInOauthData, true>, TContext>,
    'mutationKey' | 'mutationFn'
  >,
) =>
  useMutation<TData, TError, Options<SignInOauthData, true>, TContext>({
    mutationKey: Common.UseSignInOauthKeyFn(mutationKey),
    mutationFn: (clientOptions) => signInOauth(clientOptions) as unknown as Promise<TData>,
    ...options,
  });
export const useUpdateMe = <
  TData = Common.UpdateMeMutationResult,
  TError = AxiosError<UpdateMeError>,
  TQueryKey extends Array<unknown> = unknown[],
  TContext = unknown,
>(
  mutationKey?: TQueryKey,
  options?: Omit<
    UseMutationOptions<TData, TError, Options<UpdateMeData, true>, TContext>,
    'mutationKey' | 'mutationFn'
  >,
) =>
  useMutation<TData, TError, Options<UpdateMeData, true>, TContext>({
    mutationKey: Common.UseUpdateMeKeyFn(mutationKey),
    mutationFn: (clientOptions) => updateMe(clientOptions) as unknown as Promise<TData>,
    ...options,
  });
export const useUpdateReview = <
  TData = Common.UpdateReviewMutationResult,
  TError = AxiosError<UpdateReviewError>,
  TQueryKey extends Array<unknown> = unknown[],
  TContext = unknown,
>(
  mutationKey?: TQueryKey,
  options?: Omit<
    UseMutationOptions<TData, TError, Options<UpdateReviewData, true>, TContext>,
    'mutationKey' | 'mutationFn'
  >,
) =>
  useMutation<TData, TError, Options<UpdateReviewData, true>, TContext>({
    mutationKey: Common.UseUpdateReviewKeyFn(mutationKey),
    mutationFn: (clientOptions) => updateReview(clientOptions) as unknown as Promise<TData>,
    ...options,
  });
export const useUpdateProduct = <
  TData = Common.UpdateProductMutationResult,
  TError = AxiosError<UpdateProductError>,
  TQueryKey extends Array<unknown> = unknown[],
  TContext = unknown,
>(
  mutationKey?: TQueryKey,
  options?: Omit<
    UseMutationOptions<TData, TError, Options<UpdateProductData, true>, TContext>,
    'mutationKey' | 'mutationFn'
  >,
) =>
  useMutation<TData, TError, Options<UpdateProductData, true>, TContext>({
    mutationKey: Common.UseUpdateProductKeyFn(mutationKey),
    mutationFn: (clientOptions) => updateProduct(clientOptions) as unknown as Promise<TData>,
    ...options,
  });
export const useUnlikeReview = <
  TData = Common.UnlikeReviewMutationResult,
  TError = AxiosError<UnlikeReviewError>,
  TQueryKey extends Array<unknown> = unknown[],
  TContext = unknown,
>(
  mutationKey?: TQueryKey,
  options?: Omit<
    UseMutationOptions<TData, TError, Options<UnlikeReviewData, true>, TContext>,
    'mutationKey' | 'mutationFn'
  >,
) =>
  useMutation<TData, TError, Options<UnlikeReviewData, true>, TContext>({
    mutationKey: Common.UseUnlikeReviewKeyFn(mutationKey),
    mutationFn: (clientOptions) => unlikeReview(clientOptions) as unknown as Promise<TData>,
    ...options,
  });
export const useDeleteReview = <
  TData = Common.DeleteReviewMutationResult,
  TError = AxiosError<DeleteReviewError>,
  TQueryKey extends Array<unknown> = unknown[],
  TContext = unknown,
>(
  mutationKey?: TQueryKey,
  options?: Omit<
    UseMutationOptions<TData, TError, Options<DeleteReviewData, true>, TContext>,
    'mutationKey' | 'mutationFn'
  >,
) =>
  useMutation<TData, TError, Options<DeleteReviewData, true>, TContext>({
    mutationKey: Common.UseDeleteReviewKeyFn(mutationKey),
    mutationFn: (clientOptions) => deleteReview(clientOptions) as unknown as Promise<TData>,
    ...options,
  });
export const useDeleteProduct = <
  TData = Common.DeleteProductMutationResult,
  TError = AxiosError<DeleteProductError>,
  TQueryKey extends Array<unknown> = unknown[],
  TContext = unknown,
>(
  mutationKey?: TQueryKey,
  options?: Omit<
    UseMutationOptions<TData, TError, Options<DeleteProductData, true>, TContext>,
    'mutationKey' | 'mutationFn'
  >,
) =>
  useMutation<TData, TError, Options<DeleteProductData, true>, TContext>({
    mutationKey: Common.UseDeleteProductKeyFn(mutationKey),
    mutationFn: (clientOptions) => deleteProduct(clientOptions) as unknown as Promise<TData>,
    ...options,
  });
export const useUnfollow = <
  TData = Common.UnfollowMutationResult,
  TError = AxiosError<UnfollowError>,
  TQueryKey extends Array<unknown> = unknown[],
  TContext = unknown,
>(
  mutationKey?: TQueryKey,
  options?: Omit<
    UseMutationOptions<TData, TError, Options<UnfollowData, true>, TContext>,
    'mutationKey' | 'mutationFn'
  >,
) =>
  useMutation<TData, TError, Options<UnfollowData, true>, TContext>({
    mutationKey: Common.UseUnfollowKeyFn(mutationKey),
    mutationFn: (clientOptions) => unfollow(clientOptions) as unknown as Promise<TData>,
    ...options,
  });
export const useUnfavorite = <
  TData = Common.UnfavoriteMutationResult,
  TError = AxiosError<UnfavoriteError>,
  TQueryKey extends Array<unknown> = unknown[],
  TContext = unknown,
>(
  mutationKey?: TQueryKey,
  options?: Omit<
    UseMutationOptions<TData, TError, Options<UnfavoriteData, true>, TContext>,
    'mutationKey' | 'mutationFn'
  >,
) =>
  useMutation<TData, TError, Options<UnfavoriteData, true>, TContext>({
    mutationKey: Common.UseUnfavoriteKeyFn(mutationKey),
    mutationFn: (clientOptions) => unfavorite(clientOptions) as unknown as Promise<TData>,
    ...options,
  });
