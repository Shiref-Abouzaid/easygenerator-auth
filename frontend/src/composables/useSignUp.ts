import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useFormErrors } from '@/composables/useFormErrors';
import { authService } from '@/services/auth';
import { useAuthStore } from '@/stores/auth';
import { validators } from '@/utils/validators';

export function useSignUp() {
  const router = useRouter();
  const auth = useAuthStore();

  const form = reactive({
    email: '',
    name: '',
    password: '',
    confirmPassword: '',
  });
  const { errors, formError, validate, applyApiError } = useFormErrors(form, {
    email: validators.email,
    name: validators.name,
    password: validators.password,
    confirmPassword: (value) =>
      value === form.password ? undefined : 'Passwords do not match.',
  });
  const isSubmitting = ref(false);

  async function submit() {
    if (isSubmitting.value || !validate()) return;

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