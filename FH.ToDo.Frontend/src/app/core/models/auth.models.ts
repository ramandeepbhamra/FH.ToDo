export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string | null;
}

export interface TokenInfo {
  accessToken: string;
  expiresAt: string;
  expiresInSeconds: number;
  refreshToken: string;
  refreshTokenExpiresAt: string;
}

export interface UserInfo {
  id: string;
  email: string;
  fullName: string;
  role: string;
}

export interface LoginResponse {
  token: TokenInfo;
  user: UserInfo;
}

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: string;
}
