export function deepFind(obj: Record<string, any>, path: string) {
  const paths = path.split('.');
  let current = obj;
  for (const currPath of paths) {
    if (current[currPath] === undefined) {
      return undefined;
    }
    current = current[currPath];
  }
  return current;
}
