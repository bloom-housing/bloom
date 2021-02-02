import { CsvEncoder } from "./csv-encoder.service"
import { Injectable } from "@nestjs/common"
import { CSVFormattingType } from "./formatting/application-formatting-metadata-factory"

export type FormattingMetadata = {
  label: string
  discriminator: string
  formatter: (obj) => string
  type?: "array" | "object"
}

export type FormattingMetadataArray = {
  discriminator: string
  type: string
  items: FormattingMetadata[]
  size: number | null
}

export type FormattingMetadataAggregate = Array<FormattingMetadata | FormattingMetadataArray>
export type FormattingMetadataAggregateFactory = (
  type: CSVFormattingType
) => FormattingMetadataAggregate

export const defaultFormatter = (obj?) => (obj ? obj.toString() : "")
export const booleanFormatter = (obj?: boolean) => (obj ? "Yes" : "No")
export const streetFormatter = (obj?: { street?: string; street2?: string }) => {
  if (!obj) {
    return defaultFormatter(obj)
  }
  if (!obj.street && !obj.street2) {
    return ""
  }
  if (!obj.street) {
    return obj.street2
  }
  if (!obj.street2) {
    return obj.street
  }
  return `${obj.street}, ${obj.street2}`
}
export const dobFormatter = (obj?: {
  birthMonth?: string
  birthDay?: string
  birthYear?: string
}) => {
  // TODO Use locale variable Date string
  return obj ? `${obj.birthMonth}/${obj.birthDay}/${obj.birthYear}` : defaultFormatter(obj)
}
export const joinArrayFormatter = (obj?: string[]) => (obj ? obj.join(",") : "")
export const keysToJoinedStringFormatter = (obj: any) => {
  if (!obj) {
    return defaultFormatter(obj)
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
        value = undefined
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
        try {
          outputRows.push(metadata.formatter(value))
        } catch (e) {
          outputRows.push("")
        }
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

  private normalizeMetadataArrays(
    arr: any[],
    formattingMetadataAggregate: FormattingMetadataAggregate
  ) {
    formattingMetadataAggregate
      .filter((metadata) => metadata.type === "array")
      .forEach((metadata) => {
        const md = metadata as FormattingMetadataArray
        if (md.size !== null) {
          return
        }
        md.size = Math.max(
          ...arr.map((item) => {
            const value = this.retrieveValueByDiscriminator(item, md.discriminator)
            if (!value || !Array.isArray(value)) {
              return 0
            }
            return value.length
          })
        )
      })
    return formattingMetadataAggregate
  }

  public build(
    arr: any[],
    formattingMetadataAggregateFactory: FormattingMetadataAggregateFactory,
    csvFormattingType: CSVFormattingType,
    includeHeaders?: boolean
  ): string {
    const formattingMetadataAggregate = formattingMetadataAggregateFactory(csvFormattingType)
    if (!formattingMetadataAggregate) {
      return ""
    }
    const normalizedMetadataAggregate = this.normalizeMetadataArrays(
      arr,
      formattingMetadataAggregate
    )
    const rows: Array<Array<string>> = []
    rows.push(this.getHeaders(normalizedMetadataAggregate))
    arr.forEach((item) => rows.push(this.flattenJson(item, normalizedMetadataAggregate)))
    return this.csvEncoder.encode(rows, includeHeaders)
  }
}
