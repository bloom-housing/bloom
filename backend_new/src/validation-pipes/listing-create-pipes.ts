import { ArgumentMetadata, ValidationPipe } from '@nestjs/common';
import { ListingsStatusEnum } from '@prisma/client';
import { ListingCreate } from '../dtos/listings/listing-create.dto';
import { ListingPublishedCreate } from '../dtos/listings/listing-published-create.dto';

export class ListingCreateValidationPipe extends ValidationPipe {
  statusToListingValidationModelMap: Record<
    ListingsStatusEnum,
    typeof ListingCreate
  > = {
    [ListingsStatusEnum.closed]: ListingCreate,
    [ListingsStatusEnum.pending]: ListingCreate,
    [ListingsStatusEnum.active]: ListingPublishedCreate,
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
