import { Transform } from 'class-transformer';

// Because of low-level behavior with in the `qs` library,  array params over 21 items turns into
// an object with key-pairs of indices and values. This can break data input at the controller level.
// The following decorator restores that object to a standard array.
// See: https://stackoverflow.com/a/75380449

/**
 * Because of low-level behavior within the `qs` library,  array params over 21 items turn into
 * objects with key-pairs of indices and values. This can break data input at the controller level.
 * The following decorator restores that object to a standard array.
 * See: https://stackoverflow.com/a/75380449
 *
 * @returns {PropertyDecorator}
 */
export function FixLargeObjectArray(): PropertyDecorator {
  return Transform(({ value }) =>
    value && typeof value === 'object' ? Object.values(value) : value,
  );
}
