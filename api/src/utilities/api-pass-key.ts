import { timingSafeEqual } from 'crypto';

export const matchesApiPassKey = (supplied: unknown): boolean => {
  const secret = process.env.API_PASS_KEY;
  if (!secret || typeof supplied !== 'string') return false;

  const a = Buffer.from(supplied);
  const b = Buffer.from(secret);

  return a.length === b.length && timingSafeEqual(a, b);
};
