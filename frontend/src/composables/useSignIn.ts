import { reactive, ref } from 'vue';

export function useSignIn() {
  const form = reactive({ email: '', password: '' });
  const errors = reactive<Partial<Record<keyof typeof form, string>>>({});
  const formError = ref('');
  const isSubmitting = ref(false);

  function submit() {
    // Validation and API call are added in the next step.
  }

  return { form, errors, formError, isSubmitting, submit };
}