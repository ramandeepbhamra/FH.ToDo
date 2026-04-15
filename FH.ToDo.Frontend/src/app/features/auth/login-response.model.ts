import { TokenResponse } from './token-response.model';
import { UserInfo } from './user-info.model';

export interface LoginResponse {
  token: TokenResponse;
  user: UserInfo;
}
