import { request } from '@/services/http';
import type {
  AuthResponse,
  SignInPayload,
  SignUpPayload,
  User,
} from '@/types/auth';

export const authService = {
  signUp: (payload: SignUpPayload) =>
    request<AuthResponse>('/auth/sign-up', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  signIn: (payload: SignInPayload) =>
    request<AuthResponse>('/auth/sign-in', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  getMe: () => request<User>('/users/me'),
};
