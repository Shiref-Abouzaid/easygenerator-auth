export type Validator = (value: string) => string | undefined;
export type Rules<Field extends string> = Partial<Record<Field, Validator>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_PATTERN = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d\s]).{8,}$/;

export const validators = {
  email: (value: string) =>
    EMAIL_PATTERN.test(value.trim())
      ? undefined
      : 'Please enter a valid email address.',

  name: (value: string) => {
    const length = value.trim().length;
    return length >= 3 && length <= 50
      ? undefined
      : 'Name must be between 3 and 50 characters.';
  },

  password: (value: string) => {
    if (value.length > 128) return 'Password must be at most 128 characters.';
    return PASSWORD_PATTERN.test(value)
      ? undefined
      : 'Password must be at least 8 characters and include a letter, a number and a special character.';
  },

  required:
    (message: string): Validator =>
    (value) =>
      value ? undefined : message,
};