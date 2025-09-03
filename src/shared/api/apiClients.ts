import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';

import {
  AuthApi,
  Configuration,
  FollowApi,
  ImageApi,
  OauthApi,
  ProductApi,
  ReviewApi,
  UserApi,
} from '../../../ts-client';
import { BASE_URL } from '../constants/constants';

export const privateApiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

//토큰이 필요한 요청에 대한 인터셉터
privateApiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const accessToken = Cookies.get('accessToken');

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

const config = new Configuration({
  baseOptions: {
    ...privateApiClient.defaults,
  },
});

export const api = {
  user: new UserApi(config, undefined, privateApiClient),
  review: new ReviewApi(config, undefined, privateApiClient),
  product: new ProductApi(config, undefined, privateApiClient),
  oauth: new OauthApi(config, undefined, privateApiClient),
  image: new ImageApi(config, undefined, privateApiClient),
  follow: new FollowApi(config, undefined, privateApiClient),
  auth: new AuthApi(config, undefined, privateApiClient),
};
