export interface BaseUser {
  id: number;
  nickname: string;
  description: string;
  image: null | string;
  createdAt: string;
  updatedAt: string;
  teamId: string;
}

export interface DetailUser extends BaseUser {
  isFollowing: boolean;
  followersCount: number;
  followeesCount: number;
  reviewCount: number;
  averageRating: number;
  mostFavoriteCategory: { name: string; id: number } | null;
}

export interface UserState {
  user: DetailUser | null;
  isLoggedIn: boolean;
  setUser: (user: DetailUser) => void;
  updateUser: (updatedUser: DetailUser) => void;
  initializeAuth: () => void;
  clearUser: () => void;
}
