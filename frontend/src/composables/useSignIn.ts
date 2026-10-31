import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useFormErrors } from '@/composables/useFormErrors';
import { authService } from '@/services/auth';
import { useAuthStore } from '@/stores/auth';
import { validators } from '@/utils/validators';

export function useSignIn() {
  const router = useRouter();
  const auth = useAuthStore();

  const form = reactive({ email: '', password: '' });
  const { errors, formError, validate, applyApiError } = useFormErrors(form, {
    email: validators.email,
    password: validators.required('Password is required.'),
  });
  const isSubmitting = ref(false);

  async function submit() {
    if (isSubmitting.value || !validate()) return;

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