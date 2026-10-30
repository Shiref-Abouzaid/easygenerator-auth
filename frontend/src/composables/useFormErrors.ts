import { reactive, ref } from 'vue';
import { ApiError } from '@/services/http';

export function useFormErrors<Field extends string>() {
  const errors: Partial<Record<Field, string>> = reactive({});
  const formError = ref('');

  function clearErrors() {
    for (const key of Object.keys(errors) as Field[]) {
      delete errors[key];
    }
    formError.value = '';
  }

  function applyApiError(error: unknown) {
    if (!(error instanceof ApiError)) {
      formError.value = 'Something went wrong. Please try again.';
      return;
    }

    for (const { field, message } of error.fieldErrors) {
      errors[field as Field] = message;
    }

    if (error.fieldErrors.length === 0) {
      formError.value = error.message;
    }
  }

  return { errors, formError, clearErrors, applyApiError };
}