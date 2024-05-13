import { randomInt } from 'crypto';

export const generateSingleUseCode = (lengthOfCode: number) => {
  let out = '';
  const characters = '0123456789';
  for (let i = 0; i < lengthOfCode; i++) {
    out += characters.charAt(randomInt(characters.length));
  }
  return out;
};
