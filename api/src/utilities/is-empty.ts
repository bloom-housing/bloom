/**
 * Determines if object is an empty array, empty object, undefined, null or an
 * empty string.
 */
export function isEmpty(obj: unknown): boolean {
  return (
    obj === undefined ||
    obj === null ||
    (obj instanceof Array && obj.length === 0) ||
    (obj instanceof Object &&
      Object.getPrototypeOf(obj) === Object.prototype &&
      Object.keys(obj).length === 0) ||
    obj === ''
  );
}
