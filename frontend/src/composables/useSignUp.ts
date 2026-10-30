import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useFormErrors } from '@/composables/useFormErrors';
import { authService } from '@/services/auth';
import { useAuthStore } from '@/stores/auth';

export function useSignUp() {
  const router = useRouter();
  const auth = useAuthStore();

  const form = reactive({ email: '', name: '', password: '', confirmPassword: '' });
  const { errors, formError, clearErrors, applyApiError } = useFormErrors<keyof typeof form>();
  const isSubmitting = ref(false);

  async function submit() {
    if (isSubmitting.value) return;

    clearErrors();

    if (form.password !== form.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
      return;
    }

    isSubmitting.value = true;

    try {
      const { email, name, password } = form;
      auth.setSession(await authService.signUp({ email, name, password }));
      await router.push({ name: 'app' });
    } catch (error) {
      applyApiError(error);
    } finally {
      isSubmitting.value = false;
    }
  }

  return { form, errors, formError, isSubmitting, submit };
}