import { FormattingMetadataAggregateFactory } from "../csv-builder.service"
import { haywardFormattingMetadata } from "./hayward-formatting-metadata"
import { basicFormattingMetadata } from "./basic-formatting-metadata"

export enum CSVFormattingType {
  basic = "basic",
  withDisplaceeNameAndAddress = "withDisplaceeNameAndAddress",
}

export const applicationFormattingMetadataAggregateFactory: FormattingMetadataAggregateFactory = (
  type: CSVFormattingType
) => {
  switch (type) {
    case CSVFormattingType.basic:
      return basicFormattingMetadata
    case CSVFormattingType.withDisplaceeNameAndAddress:
      return haywardFormattingMetadata
  }
}
