// generated with @7nohe/openapi-react-query-codegen@2.0.0-beta.3

import { type Options } from '@hey-api/client-axios';
import { UseQueryResult } from '@tanstack/react-query';

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
export type MeDefaultResponse = Awaited<ReturnType<typeof me>>['data'];
export type MeQueryResult<TData = MeDefaultResponse, TError = unknown> = UseQueryResult<
  TData,
  TError
>;
export const useMeKey = 'Me';
export const UseMeKeyFn = (clientOptions: Options<unknown, true>, queryKey?: Array<unknown>) => [
  useMeKey,
  ...(queryKey ?? [clientOptions]),
];
export type UserRankingDefaultResponse = Awaited<ReturnType<typeof userRanking>>['data'];
export type UserRankingQueryResult<
  TData = UserRankingDefaultResponse,
  TError = unknown,
> = UseQueryResult<TData, TError>;
export const useUserRankingKey = 'UserRanking';
export const UseUserRankingKeyFn = (
  clientOptions: Options<unknown, true>,
  queryKey?: Array<unknown>,
) => [useUserRankingKey, ...(queryKey ?? [clientOptions])];
export type UserDetailDefaultResponse = Awaited<ReturnType<typeof userDetail>>['data'];
export type UserDetailQueryResult<
  TData = UserDetailDefaultResponse,
  TError = unknown,
> = UseQueryResult<TData, TError>;
export const useUserDetailKey = 'UserDetail';
export const UseUserDetailKeyFn = (
  clientOptions: Options<unknown, true>,
  queryKey?: Array<unknown>,
) => [useUserDetailKey, ...(queryKey ?? [clientOptions])];
export type ListUserCreatedProductsDefaultResponse = Awaited<
  ReturnType<typeof listUserCreatedProducts>
>['data'];
export type ListUserCreatedProductsQueryResult<
  TData = ListUserCreatedProductsDefaultResponse,
  TError = unknown,
> = UseQueryResult<TData, TError>;
export const useListUserCreatedProductsKey = 'ListUserCreatedProducts';
export const UseListUserCreatedProductsKeyFn = (
  clientOptions: Options<unknown, true>,
  queryKey?: Array<unknown>,
) => [useListUserCreatedProductsKey, ...(queryKey ?? [clientOptions])];
export type ListUserReviewedProductsDefaultResponse = Awaited<
  ReturnType<typeof listUserReviewedProducts>
>['data'];
export type ListUserReviewedProductsQueryResult<
  TData = ListUserReviewedProductsDefaultResponse,
  TError = unknown,
> = UseQueryResult<TData, TError>;
export const useListUserReviewedProductsKey = 'ListUserReviewedProducts';
export const UseListUserReviewedProductsKeyFn = (
  clientOptions: Options<unknown, true>,
  queryKey?: Array<unknown>,
) => [useListUserReviewedProductsKey, ...(queryKey ?? [clientOptions])];
export type ListUserFavoriteProductsDefaultResponse = Awaited<
  ReturnType<typeof listUserFavoriteProducts>
>['data'];
export type ListUserFavoriteProductsQueryResult<
  TData = ListUserFavoriteProductsDefaultResponse,
  TError = unknown,
> = UseQueryResult<TData, TError>;
export const useListUserFavoriteProductsKey = 'ListUserFavoriteProducts';
export const UseListUserFavoriteProductsKeyFn = (
  clientOptions: Options<unknown, true>,
  queryKey?: Array<unknown>,
) => [useListUserFavoriteProductsKey, ...(queryKey ?? [clientOptions])];
export type ListUserFolloweesDefaultResponse = Awaited<
  ReturnType<typeof listUserFollowees>
>['data'];
export type ListUserFolloweesQueryResult<
  TData = ListUserFolloweesDefaultResponse,
  TError = unknown,
> = UseQueryResult<TData, TError>;
export const useListUserFolloweesKey = 'ListUserFollowees';
export const UseListUserFolloweesKeyFn = (
  clientOptions: Options<unknown, true>,
  queryKey?: Array<unknown>,
) => [useListUserFolloweesKey, ...(queryKey ?? [clientOptions])];
export type ListUserFollowersDefaultResponse = Awaited<
  ReturnType<typeof listUserFollowers>
>['data'];
export type ListUserFollowersQueryResult<
  TData = ListUserFollowersDefaultResponse,
  TError = unknown,
> = UseQueryResult<TData, TError>;
export const useListUserFollowersKey = 'ListUserFollowers';
export const UseListUserFollowersKeyFn = (
  clientOptions: Options<unknown, true>,
  queryKey?: Array<unknown>,
) => [useListUserFollowersKey, ...(queryKey ?? [clientOptions])];
export type ListProductDefaultResponse = Awaited<ReturnType<typeof listProduct>>['data'];
export type ListProductQueryResult<
  TData = ListProductDefaultResponse,
  TError = unknown,
> = UseQueryResult<TData, TError>;
export const useListProductKey = 'ListProduct';
export const UseListProductKeyFn = (
  clientOptions: Options<unknown, true>,
  queryKey?: Array<unknown>,
) => [useListProductKey, ...(queryKey ?? [clientOptions])];
export type RetrieveProductDefaultResponse = Awaited<ReturnType<typeof retrieveProduct>>['data'];
export type RetrieveProductQueryResult<
  TData = RetrieveProductDefaultResponse,
  TError = unknown,
> = UseQueryResult<TData, TError>;
export const useRetrieveProductKey = 'RetrieveProduct';
export const UseRetrieveProductKeyFn = (
  clientOptions: Options<unknown, true>,
  queryKey?: Array<unknown>,
) => [useRetrieveProductKey, ...(queryKey ?? [clientOptions])];
export type ListReviewsDefaultResponse = Awaited<ReturnType<typeof listReviews>>['data'];
export type ListReviewsQueryResult<
  TData = ListReviewsDefaultResponse,
  TError = unknown,
> = UseQueryResult<TData, TError>;
export const useListReviewsKey = 'ListReviews';
export const UseListReviewsKeyFn = (
  clientOptions: Options<unknown, true>,
  queryKey?: Array<unknown>,
) => [useListReviewsKey, ...(queryKey ?? [clientOptions])];
export type ListAllCategoryDefaultResponse = Awaited<ReturnType<typeof listAllCategory>>['data'];
export type ListAllCategoryQueryResult<
  TData = ListAllCategoryDefaultResponse,
  TError = unknown,
> = UseQueryResult<TData, TError>;
export const useListAllCategoryKey = 'ListAllCategory';
export const UseListAllCategoryKeyFn = (
  clientOptions: Options<unknown, true>,
  queryKey?: Array<unknown>,
) => [useListAllCategoryKey, ...(queryKey ?? [clientOptions])];
export type LikeReviewMutationResult = Awaited<ReturnType<typeof likeReview>>;
export const useLikeReviewKey = 'LikeReview';
export const UseLikeReviewKeyFn = (mutationKey?: Array<unknown>) => [
  useLikeReviewKey,
  ...(mutationKey ?? []),
];
export type CreateReviewMutationResult = Awaited<ReturnType<typeof createReview>>;
export const useCreateReviewKey = 'CreateReview';
export const UseCreateReviewKeyFn = (mutationKey?: Array<unknown>) => [
  useCreateReviewKey,
  ...(mutationKey ?? []),
];
export type CreateProductMutationResult = Awaited<ReturnType<typeof createProduct>>;
export const useCreateProductKey = 'CreateProduct';
export const UseCreateProductKeyFn = (mutationKey?: Array<unknown>) => [
  useCreateProductKey,
  ...(mutationKey ?? []),
];
export type UpsertOauthAppMutationResult = Awaited<ReturnType<typeof upsertOauthApp>>;
export const useUpsertOauthAppKey = 'UpsertOauthApp';
export const UseUpsertOauthAppKeyFn = (mutationKey?: Array<unknown>) => [
  useUpsertOauthAppKey,
  ...(mutationKey ?? []),
];
export type ImageUploadMutationResult = Awaited<ReturnType<typeof imageUpload>>;
export const useImageUploadKey = 'ImageUpload';
export const UseImageUploadKeyFn = (mutationKey?: Array<unknown>) => [
  useImageUploadKey,
  ...(mutationKey ?? []),
];
export type FollowMutationResult = Awaited<ReturnType<typeof follow>>;
export const useFollowKey = 'Follow';
export const UseFollowKeyFn = (mutationKey?: Array<unknown>) => [
  useFollowKey,
  ...(mutationKey ?? []),
];
export type FavoriteMutationResult = Awaited<ReturnType<typeof favorite>>;
export const useFavoriteKey = 'Favorite';
export const UseFavoriteKeyFn = (mutationKey?: Array<unknown>) => [
  useFavoriteKey,
  ...(mutationKey ?? []),
];
export type SignUpMutationResult = Awaited<ReturnType<typeof signUp>>;
export const useSignUpKey = 'SignUp';
export const UseSignUpKeyFn = (mutationKey?: Array<unknown>) => [
  useSignUpKey,
  ...(mutationKey ?? []),
];
export type SignInMutationResult = Awaited<ReturnType<typeof signIn>>;
export const useSignInKey = 'SignIn';
export const UseSignInKeyFn = (mutationKey?: Array<unknown>) => [
  useSignInKey,
  ...(mutationKey ?? []),
];
export type SignUpOauthMutationResult = Awaited<ReturnType<typeof signUpOauth>>;
export const useSignUpOauthKey = 'SignUpOauth';
export const UseSignUpOauthKeyFn = (mutationKey?: Array<unknown>) => [
  useSignUpOauthKey,
  ...(mutationKey ?? []),
];
export type SignInOauthMutationResult = Awaited<ReturnType<typeof signInOauth>>;
export const useSignInOauthKey = 'SignInOauth';
export const UseSignInOauthKeyFn = (mutationKey?: Array<unknown>) => [
  useSignInOauthKey,
  ...(mutationKey ?? []),
];
export type UpdateMeMutationResult = Awaited<ReturnType<typeof updateMe>>;
export const useUpdateMeKey = 'UpdateMe';
export const UseUpdateMeKeyFn = (mutationKey?: Array<unknown>) => [
  useUpdateMeKey,
  ...(mutationKey ?? []),
];
export type UpdateReviewMutationResult = Awaited<ReturnType<typeof updateReview>>;
export const useUpdateReviewKey = 'UpdateReview';
export const UseUpdateReviewKeyFn = (mutationKey?: Array<unknown>) => [
  useUpdateReviewKey,
  ...(mutationKey ?? []),
];
export type UpdateProductMutationResult = Awaited<ReturnType<typeof updateProduct>>;
export const useUpdateProductKey = 'UpdateProduct';
export const UseUpdateProductKeyFn = (mutationKey?: Array<unknown>) => [
  useUpdateProductKey,
  ...(mutationKey ?? []),
];
export type UnlikeReviewMutationResult = Awaited<ReturnType<typeof unlikeReview>>;
export const useUnlikeReviewKey = 'UnlikeReview';
export const UseUnlikeReviewKeyFn = (mutationKey?: Array<unknown>) => [
  useUnlikeReviewKey,
  ...(mutationKey ?? []),
];
export type DeleteReviewMutationResult = Awaited<ReturnType<typeof deleteReview>>;
export const useDeleteReviewKey = 'DeleteReview';
export const UseDeleteReviewKeyFn = (mutationKey?: Array<unknown>) => [
  useDeleteReviewKey,
  ...(mutationKey ?? []),
];
export type DeleteProductMutationResult = Awaited<ReturnType<typeof deleteProduct>>;
export const useDeleteProductKey = 'DeleteProduct';
export const UseDeleteProductKeyFn = (mutationKey?: Array<unknown>) => [
  useDeleteProductKey,
  ...(mutationKey ?? []),
];
export type UnfollowMutationResult = Awaited<ReturnType<typeof unfollow>>;
export const useUnfollowKey = 'Unfollow';
export const UseUnfollowKeyFn = (mutationKey?: Array<unknown>) => [
  useUnfollowKey,
  ...(mutationKey ?? []),
];
export type UnfavoriteMutationResult = Awaited<ReturnType<typeof unfavorite>>;
export const useUnfavoriteKey = 'Unfavorite';
export const UseUnfavoriteKeyFn = (mutationKey?: Array<unknown>) => [
  useUnfavoriteKey,
  ...(mutationKey ?? []),
];
