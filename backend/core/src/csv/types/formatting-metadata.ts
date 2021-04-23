export type FormattingMetadata = {
  label: string
  discriminator: string
  formatter: (obj) => string
  type?: "array" | "object"
}
