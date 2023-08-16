import { ArgumentMetadata, ValidationPipe } from "@nestjs/common"
import { ListingStatus } from "../types/listing-status-enum"
import { ListingCreateDto } from "../dto/listing-create.dto"
import { ListingPublishedCreateDto } from "../dto/listing-published-create.dto"

export class ListingCreateValidationPipe extends ValidationPipe {
  statusToListingValidationModelMap: Record<ListingStatus, typeof ListingCreateDto> = {
    [ListingStatus.closed]: ListingCreateDto,
    [ListingStatus.pending]: ListingCreateDto,
    [ListingStatus.active]: ListingPublishedCreateDto,
    [ListingStatus.changesRequested]: ListingPublishedCreateDto,
    [ListingStatus.pendingReview]: ListingPublishedCreateDto,
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
