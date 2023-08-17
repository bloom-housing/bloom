import { ArgumentMetadata, ValidationPipe } from '@nestjs/common';
import { ListingsStatusEnum } from '@prisma/client';
import { ListingUpdate } from '../dtos/listings/listing-update.dto';
import { ListingPublishedUpdate } from '../dtos/listings/listing-published-update.dto';

export class ListingUpdateValidationPipe extends ValidationPipe {
  statusToListingValidationModelMap: Record<
    ListingsStatusEnum,
    typeof ListingUpdate
  > = {
    [ListingsStatusEnum.closed]: ListingUpdate,
    [ListingsStatusEnum.pending]: ListingUpdate,
    [ListingsStatusEnum.active]: ListingPublishedUpdate,
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
    if (metadata.type === 'body') {
      return await super.transform(value, {
        ...metadata,
        metatype: this.statusToListingValidationModelMap[value.status],
      });
    }
    return await super.transform(value, metadata);
  }
}
