export interface UserProfile {
  email: string;
  email_verified: boolean;
  given_name: string;
  family_name: string;
  name: string;
  picture: string;
  role?: string;
  permiso?: string;
}

export interface UserInfo {
  info: UserProfile
}
