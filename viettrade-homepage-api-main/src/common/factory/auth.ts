export interface ILoginParams {
  email: string;
  password: string;
}

export interface ForgotPasswordParams {
  email: string;
}

export interface IUserInfo {
  id: number;
  name: string;
  email: string;
  role: number;
  token: {
    accessToken?: string;
    refreshToken?: string;
  };
}

export interface IContactInfo {
  fullName: string;
  email: string;
  phone: string;
  title: string;
  content: string;
}
