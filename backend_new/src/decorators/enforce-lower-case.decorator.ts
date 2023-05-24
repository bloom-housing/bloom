import { Transform } from 'class-transformer';

export function EnforceLowerCase() {
  return Transform((value: string) => (value ? value.toLowerCase() : value));
}
