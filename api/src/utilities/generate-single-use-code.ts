import { randomInt } from 'crypto';

export const generateSingleUseCode = () => {
  let out = '';
  const characters = '0123456789';
  for (let i = 0; i < Number(process.env.MFA_CODE_LENGTH); i++) {
    out += characters.charAt(randomInt(characters.length));
  }
  return out;
};
