import { randomInt } from 'crypto';

export function randomBirthDay(): number {
  return randomInt(31) + 1;
}

export function randomBirthMonth(): number {
  return randomInt(12) + 1;
}

export function randomBirthYear(): number {
  return randomInt(80) + 1930;
}
