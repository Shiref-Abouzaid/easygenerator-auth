import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { authService } from '@/services/auth';
import { ApiError } from '@/services/http';
import { tokenStorage } from '@/services/token';
import type { AuthResponse, User } from '@/types/auth';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const isAuthenticated = computed(() => user.value !== null);

  function setSession({ accessToken, user: sessionUser }: AuthResponse) {
    tokenStorage.set(accessToken);
    user.value = sessionUser;
  }

  function clearSession() {
    tokenStorage.clear();
    user.value = null;
  }

  async function restoreSession() {
    if (!tokenStorage.get()) return;

    try {
      user.value = await authService.getMe();
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        clearSession();
      }
    }
  }

  return { user, isAuthenticated, setSession, clearSession, restoreSession };
});