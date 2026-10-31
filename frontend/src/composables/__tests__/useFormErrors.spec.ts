import { describe, expect, it } from 'vitest';
import { nextTick, reactive } from 'vue';
import { ApiError } from '@/services/http';
import { useFormErrors } from '@/composables/useFormErrors';
import { validators } from '@/utils/validators';

describe('useFormErrors', () => {
  function setup() {
    const form = reactive({ email: '', password: '' });
    const state = useFormErrors(form, {
      email: validators.email,
      password: validators.required('Password is required.'),
    });
    return { form, ...state };
  }

  it('reports field errors on validate', () => {
    const { validate, errors } = setup();
    expect(validate()).toBe(false);
    expect(errors.email).toBeDefined();
    expect(errors.password).toBe('Password is required.');
  });

  it('clears a field error once the user fixes it', async () => {
    const { form, validate, errors } = setup();
    validate();
    form.email = 'user@example.com';
    await nextTick();
    expect(errors.email).toBeUndefined();
  });

  it('maps api field errors and general errors', () => {
    const { applyApiError, errors, formError } = setup();
    applyApiError(
      new ApiError(409, 'Conflict', [{ field: 'email', message: 'Taken' }]),
    );
    expect(errors.email).toBe('Taken');
    applyApiError(new ApiError(401, 'Invalid email or password.'));
    expect(formError.value).toBe('Invalid email or password.');
  });
});
