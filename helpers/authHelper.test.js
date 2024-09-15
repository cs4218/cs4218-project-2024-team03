// passwordUtils.test.js

import { hashPassword, comparePassword } from './authHelper';

describe('Password Utilities', () => {
  const plainPassword = 'SecureP@ssw0rd!';

  test('hashPassword should return a hashed password', async () => {
    const hashedPassword = await hashPassword(plainPassword);
    expect(hashedPassword).not.toBe(plainPassword);
    expect(typeof hashedPassword).toBe('string');
    expect(hashedPassword.length).toBeGreaterThan(0);
  });

  test('comparePassword should return true for correct password', async () => {
    const hashedPassword = await hashPassword(plainPassword);
    const isMatch = await comparePassword(plainPassword, hashedPassword);
    expect(isMatch).toBe(true);
  });

  test('comparePassword should return false for incorrect password', async () => {
    const hashedPassword = await hashPassword(plainPassword);
    const isMatch = await comparePassword('WrongPassword', hashedPassword);
    expect(isMatch).toBe(false);
  });

  test('hashing the same password should produce different hashes (due to salting)', async () => {
    const hashedPassword1 = await hashPassword(plainPassword);
    const hashedPassword2 = await hashPassword(plainPassword);
    expect(hashedPassword1).not.toBe(hashedPassword2);
  });

  test('comparePassword should handle errors gracefully', async () => {
    await expect(comparePassword(null, null)).resolves.toBe(false);
  });
});
