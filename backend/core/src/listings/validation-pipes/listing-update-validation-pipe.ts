import { ArgumentMetadata, ValidationPipe } from "@nestjs/common"
import { ListingStatus } from "../types/listing-status-enum"
import { ListingUpdateDto } from "../dto/listing-update.dto"
import { ListingPublishedUpdateDto } from "../dto/listing-published-update.dto"

export class ListingUpdateValidationPipe extends ValidationPipe {
  statusToListingValidationModelMap: Record<ListingStatus, typeof ListingUpdateDto> = {
    [ListingStatus.closed]: ListingUpdateDto,
    [ListingStatus.pending]: ListingUpdateDto,
    [ListingStatus.active]: ListingPublishedUpdateDto,
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
    if (metadata.type === "body") {
      return await super.transform(value, {
        ...metadata,
        metatype: this.statusToListingValidationModelMap[value.status],
      })
    }
    return await super.transform(value, metadata)
  }
}
