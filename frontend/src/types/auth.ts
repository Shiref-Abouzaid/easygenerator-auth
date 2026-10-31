export interface User {
  id: string;
  email: string;
  name: string;
}

export interface SignUpPayload {
  email: string;
  name: string;
  password: string;
}

export interface SignInPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}
