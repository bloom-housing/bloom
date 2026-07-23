import { createHash } from 'crypto';

// Canonical hash of an English source value. Stored on a non-English row so staleness can be
// detected: a value is stale when its stored hash no longer matches the current English hash.
export function sourceHash(value: string): string {
  return createHash('sha256').update(value, 'utf8').digest('hex');
}
