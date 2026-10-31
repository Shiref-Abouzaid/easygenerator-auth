import { reactive, ref, watch } from 'vue';
import { ApiError } from '@/services/http';
import type { Rules } from '@/utils/validators';

export function useFormErrors<Field extends string>(
  form: Record<Field, string>,
  rules: Rules<Field>,
) {
  const errors: Partial<Record<Field, string>> = reactive({});
  const formError = ref('');
  const fields = Object.keys(form) as Field[];
  let submitted = false;

  function validateField(field: Field) {
    const message = rules[field]?.(form[field]);
    if (message) {
      errors[field] = message;
    } else {
      delete errors[field];
    }
  }

  function validate(): boolean {
    submitted = true;
    formError.value = '';
    fields.forEach(validateField);
    return Object.keys(errors).length === 0;
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

  // After the first submit, re-check each field as the user edits it.
  for (const field of fields) {
    watch(
      () => form[field],
      () => {
        if (submitted) validateField(field);
      },
    );
  }

  return { errors, formError, validate, applyApiError };
}