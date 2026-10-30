import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

export function useSignOut() {
  const router = useRouter();
  const auth = useAuthStore();

  async function signOut() {
    auth.clearSession();
    await router.push({ name: 'sign-in' });
  }

  return { signOut };
}