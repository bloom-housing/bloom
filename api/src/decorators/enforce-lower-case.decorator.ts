import { Transform, TransformFnParams } from 'class-transformer';

export function EnforceLowerCase() {
  return Transform((param: TransformFnParams) =>
    param?.value ? param.value.toLowerCase() : param.value,
  );
}
