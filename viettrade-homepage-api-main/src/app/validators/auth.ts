import { body, S, V } from './custom';

export const login = [
  body('*', [S.emptyStringAsNull]),
  body('email', 'email', [V.required, V.isValidEmail]),
  body('password', 'password', [V.required, V.maxLength(255), V.minLength(8)])
];

export const refreshToken = [
  body('*', [S.emptyStringAsNull]),
  body('refreshToken', 'refreshToken', [V.required])
];

export const logout = refreshToken;
