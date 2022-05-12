export type HasKeys<T> = {
  [P in keyof T]: unknown
}
