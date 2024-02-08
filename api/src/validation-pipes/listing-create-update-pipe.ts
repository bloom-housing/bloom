import { ArgumentMetadata, ValidationPipe } from '@nestjs/common';
import { ListingsStatusEnum } from '@prisma/client';
import { ListingUpdate } from '../dtos/listings/listing-update.dto';
import { ListingPublishedUpdate } from '../dtos/listings/listing-published-update.dto';
import { ListingCreate } from '../dtos/listings/listing-create.dto';
import { ListingPublishedCreate } from '../dtos/listings/listing-published-create.dto';

export class ListingCreateUpdateValidationPipe extends ValidationPipe {
  statusToListingValidationModelMapForUpdate: Record<
    ListingsStatusEnum,
    typeof ListingUpdate
  > = {
    [ListingsStatusEnum.closed]: ListingUpdate,
    [ListingsStatusEnum.pending]: ListingUpdate,
    [ListingsStatusEnum.active]: ListingPublishedUpdate,
    [ListingsStatusEnum.pendingReview]: ListingUpdate,
    [ListingsStatusEnum.changesRequested]: ListingUpdate,
  };

  statusToListingValidationModelMapForCreate: Record<
    ListingsStatusEnum,
    typeof ListingCreate
  > = {
    [ListingsStatusEnum.closed]: ListingCreate,
    [ListingsStatusEnum.pending]: ListingCreate,
    [ListingsStatusEnum.active]: ListingPublishedCreate,
    [ListingsStatusEnum.pendingReview]: ListingCreate,
    [ListingsStatusEnum.changesRequested]: ListingCreate,
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
    if (metadata.type === 'body') {
      return await super.transform(value, {
        ...metadata,
        metatype: value.id
          ? this.statusToListingValidationModelMapForUpdate[value.status]
          : this.statusToListingValidationModelMapForCreate[value.status],
      });
    }
    return await super.transform(value, metadata);
  }
}
