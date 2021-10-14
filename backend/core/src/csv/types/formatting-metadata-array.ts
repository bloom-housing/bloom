import { FormattingMetadata } from "./formatting-metadata"

export type FormattingMetadataArray = {
  discriminator: string
  type: string
  items: FormattingMetadata[]
  size: number | null
}
