export function deepFind(obj: Record<string, any>, path: string) {
  const paths = path.split('.');
  let current = obj;

  paths.forEach((path) => {
    if (current[path] == undefined) {
      return undefined;
    }
    current = current[path];
  });
  return current;
}
