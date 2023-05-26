import { ClassTransformOptions, plainToClass } from 'class-transformer';
import { ClassType } from 'class-transformer/ClassTransformer';

export function mapTo<T, V>(
  cls: ClassType<T>,
  plain: V[],
  options?: ClassTransformOptions,
): T[];
export function mapTo<T, V>(
  cls: ClassType<T>,
  plain: V,
  options?: ClassTransformOptions,
): T;

/*
  This maps a plain object to the class provided
  This is mostly used by controllers to map the result of a service to the type returned by the endpoint
*/
export function mapTo<T>(
  cls: ClassType<T>,
  plain,
  options?: ClassTransformOptions,
) {
  return plainToClass(cls, plain, {
    ...options,
    excludeExtraneousValues: true,
    enableImplicitConversion: true,
  });
}
