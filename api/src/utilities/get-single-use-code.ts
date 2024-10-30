import { randomInt } from 'crypto';

const generateNewCode = (lengthOfCode: number) => {
  let out = '';
  const characters = '0123456789';
  for (let i = 0; i < lengthOfCode; i++) {
    out += characters.charAt(randomInt(characters.length));
  }
  return out;
};

export const getSingleUseCode = (
  lengthOfCode: number,
  storedSingleUseCode: string,
  singleUseCodeUpdatedAt: Date,
  ttl: number,
): string => {
  // if the code is still valid, send the same code again otherwise generate a fresh code
  if (
    storedSingleUseCode &&
    new Date(singleUseCodeUpdatedAt.getTime() + ttl) > new Date()
  ) {
    return storedSingleUseCode;
  } else {
    return generateNewCode(lengthOfCode);
  }
};
