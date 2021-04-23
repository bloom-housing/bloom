import { haywardFormattingMetadata } from "./metadata/hayward-formatting-metadata"
import { basicFormattingMetadata } from "./metadata/basic-formatting-metadata"
import { CSVFormattingType } from "../types/csv-formatting-type-enum"
import { FormattingMetadataAggregateFactory } from "../types/formatting-metadata-aggregate-factory"

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
