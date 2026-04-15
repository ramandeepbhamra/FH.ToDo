export interface UserUpdateRequest {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string | null;
  isActive: boolean;
  password: string | null;
}
