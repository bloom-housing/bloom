import { timingSafeEqual } from 'crypto';

export const matchesSecret = (
  supplied: unknown,
  secret: string | undefined,
): boolean => {
  if (!secret || typeof supplied !== 'string') return false;

  const a = Buffer.from(supplied);
  const b = Buffer.from(secret);

  return a.length === b.length && timingSafeEqual(a, b);
};

export const matchesApiPassKey = (supplied: unknown): boolean =>
  matchesSecret(supplied, process.env.API_PASS_KEY);
