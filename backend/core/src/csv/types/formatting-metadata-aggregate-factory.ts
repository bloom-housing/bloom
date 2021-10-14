import { CSVFormattingType } from "./csv-formatting-type-enum"
import { FormattingMetadataAggregate } from "./formatting-metadata-aggregate"

export type FormattingMetadataAggregateFactory = (
  type: CSVFormattingType
) => FormattingMetadataAggregate
