import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useFormErrors } from '@/composables/useFormErrors';
import { authService } from '@/services/auth';
import { useAuthStore } from '@/stores/auth';

export function useSignIn() {
  const router = useRouter();
  const auth = useAuthStore();

  const form = reactive({ email: '', password: '' });
  const { errors, formError, clearErrors, applyApiError } = useFormErrors<keyof typeof form>();
  const isSubmitting = ref(false);

  async function submit() {
    if (isSubmitting.value) return;

    clearErrors();
    isSubmitting.value = true;

    try {
      auth.setSession(await authService.signIn({ ...form }));
      await router.push({ name: 'app' });
    } catch (error) {
      applyApiError(error);
    } finally {
      isSubmitting.value = false;
    }
  }

  return { form, errors, formError, isSubmitting, submit };
}