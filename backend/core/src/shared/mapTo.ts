import { ClassConstructor, ClassTransformOptions, plainToClass } from "class-transformer"

export function mapTo<T, V>(cls: ClassConstructor<T>, plain: V[], options?: ClassTransformOptions): T[]
export function mapTo<T, V>(cls: ClassConstructor<T>, plain: V, options?: ClassTransformOptions): T

export function mapTo<T>(cls: ClassConstructor<T>, plain, options?: ClassTransformOptions) {
  return plainToClass(cls, plain, {
    ...options,
    excludeExtraneousValues: true,
  })
}
