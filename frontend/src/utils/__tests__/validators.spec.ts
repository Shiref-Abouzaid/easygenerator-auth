import { describe, expect, it } from 'vitest';
import { validators } from '@/utils/validators';

describe('validators', () => {
  it('validates email format', () => {
    expect(validators.email('user@example.com')).toBeUndefined();
    expect(validators.email('not-an-email')).toBeDefined();
  });

  it('requires a name of 3 to 50 characters', () => {
    expect(validators.name('Sam')).toBeUndefined();
    expect(validators.name('  ab  ')).toBeDefined();
  });

  it.each(['abcdefg1!', 'Passw0rd#'])(
    'accepts strong password %s',
    (password) => {
      expect(validators.password(password)).toBeUndefined();
    },
  );

  it.each(['short1!', 'abcdefgh!', '12345678!', 'abcdefg12', 'abc 12345'])(
    'rejects weak password %s',
    (password) => {
      expect(validators.password(password)).toBeDefined();
    },
  );
});