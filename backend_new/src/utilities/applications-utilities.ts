import { randomBytes } from 'crypto';

export const generateConfirmationCode = (): string => {
  return randomBytes(4).toString('hex').toUpperCase();
};
