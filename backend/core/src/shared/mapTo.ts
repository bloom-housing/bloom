import { ClassType } from "class-transformer/ClassTransformer"
import { ClassTransformOptions } from "class-transformer/ClassTransformOptions"
import { plainToClass } from "class-transformer"

export function mapTo<T, V>(cls: ClassType<T>, plain: V[], options?: ClassTransformOptions): T[]
export function mapTo<T, V>(cls: ClassType<T>, plain: V, options?: ClassTransformOptions): T

export function mapTo<T>(cls: ClassType<T>, plain, options?: ClassTransformOptions) {
  return plainToClass(cls, plain, {
    ...options,
    excludeExtraneousValues: true,
  })
}
