import { CsvEncoder } from "./csv-encoder.service"
import { Injectable } from "@nestjs/common"

export type FormattingMetadata = {
  label: string
  discriminator: string
  formatter: (obj: any) => string
  type?: "array" | "object"
}

export type FormattingMetadataArray = {
  discriminator: string
  type: string
  items: FormattingMetadata[]
  size: number
}

export type FormattingMetadataAggregate = Array<FormattingMetadata | FormattingMetadataArray>

export const defaultFormatter = (obj?) => (obj ? obj.toString() : "")
export const booleanFormatter = (obj?: boolean) => (obj ? "Yes" : "No")
export const streetFormatter = (obj?: { street: string; street2: string }) => {
  if (!obj.street && !obj.street2) {
    return ""
  }
  if (!obj.street) {
    return obj.street2
  }
  if (!obj.street2) {
    return obj.street
  }
  return obj ? `${obj.street}, ${obj.street2}` : ""
}
export const dobFormatter = (obj?: { birthMonth: number; birthDay: number; birthYear: number }) => {
  return obj ? `${obj.birthMonth}/${obj.birthDay}/${obj.birthYear}` : ""
}
export const keysToJoinedStringFormatter = (obj: any) => {
  if (!obj) {
    return ""
  }
  const keys = Object.keys(obj).filter((key) => obj[key])
  return keys.join(",")
}

@Injectable()
export class CsvBuilder {
  constructor(private readonly csvEncoder: CsvEncoder) {}

  private incrementMetadataArrayItemLabel(item: FormattingMetadata, index: number) {
    const newItem = { ...item }
    newItem.label += ` (${index})`
    return newItem
  }

  private retrieveValueByDiscriminator(obj, discriminator: string) {
    let value: any = obj
    for (const key of discriminator.split(".")) {
      if (!key) {
        continue
      }
      value = value[key]
    }
    return value
  }

  private flattenJson(obj: any, metadataAggregate: FormattingMetadataAggregate): Array<string> {
    let outputRows: string[] = []
    for (const metadataObj of metadataAggregate) {
      let value
      try {
        value = this.retrieveValueByDiscriminator(obj, metadataObj.discriminator)
      } catch (e) {
        value = metadataObj.type === "array" ? [] : ""
      }
      if (metadataObj.type === "array") {
        const metadataArray: FormattingMetadataArray = metadataObj as FormattingMetadataArray
        for (let i = 0; i < metadataArray.size; i++) {
          let row
          try {
            row = value[i]
          } catch (e) {
            row = {}
          }
          const metadataArrayItems = metadataArray.items.map((item) =>
            this.incrementMetadataArrayItemLabel(item, i + 1)
          )
          outputRows = outputRows.concat(this.flattenJson(row, metadataArrayItems))
        }
      } else {
        const metadata: FormattingMetadata = metadataObj as FormattingMetadata
        outputRows.push(metadata.formatter(value))
      }
    }
    return outputRows
  }

  private getHeaders(metadataArray: any[]) {
    let headers: string[] = []
    for (const metadata of metadataArray) {
      if (metadata.type === "array") {
        for (let i = 0; i < metadata.size; i++) {
          const items = metadata.items.map((item) =>
            this.incrementMetadataArrayItemLabel(item, i + 1)
          )
          headers = headers.concat(this.getHeaders(items))
        }
      } else {
        headers.push(metadata.label)
      }
    }
    return headers
  }

  build(
    arr: any[],
    formattingMetadataAggregate: FormattingMetadataAggregate,
    includeHeaders?: boolean
  ): string {
    const rows: Array<Array<string>> = []
    const headers = this.getHeaders(formattingMetadataAggregate)
    rows.push(headers)
    arr.forEach((item) => rows.push(this.flattenJson(item, formattingMetadataAggregate)))

    return this.csvEncoder.encode(rows, includeHeaders)
  }
}
