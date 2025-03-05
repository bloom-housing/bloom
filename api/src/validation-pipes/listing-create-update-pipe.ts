import {
  ArgumentMetadata,
  BadRequestException,
  ValidationPipe,
} from '@nestjs/common';
import { ListingsStatusEnum, ReviewOrderTypeEnum } from '@prisma/client';
import { ListingUpdate } from '../dtos/listings/listing-update.dto';
import { ListingPublishedUpdate } from '../dtos/listings/listing-published-update.dto';
import { ListingCreate } from '../dtos/listings/listing-create.dto';
import { ListingPublishedCreate } from '../dtos/listings/listing-published-create.dto';
import { PrismaService } from '../services/prisma.service';

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
      if (!value.jurisdictions?.id) {
        return await super.transform(value, {
          ...metadata,
          metatype: ListingCreate,
        });
      }
      const prisma = new PrismaService();
      const jurisdictionRequiredFields = await prisma.jurisdictions.findFirst({
        select: { requiredListingFields: true },
        where: { id: value.jurisdictions.id },
      });

      const defaultRequiredFields = [
        'listingsBuildingAddress',
        'assets',
        'developer',
        'digitalApplication',
        'listingImages',
        'leasingAgentEmail',
        'leasingAgentName',
        'leasingAgentPhone',
        'name',
        'paperApplication',
        'referralOpportunity',
        'rentalAssistance',
      ];

      // defaultRequiredFields.forEach((field: string) => {
      //   // console.log('value', value);
      //   if (!value[field]) {
      //     throw new BadRequestException([`${field} is required`]);
      //   }
      // });

      console.log('pre-value', value.reviewOrderType);
      const transformed = await super.transform(
        {
          ...value,
          requiredFields: defaultRequiredFields,
        },
        {
          ...metadata,
          metatype: value.id
            ? this.statusToListingValidationModelMapForUpdate[value.status]
            : this.statusToListingValidationModelMapForCreate[value.status],
        },
      );
      // console.log(transformed);
      return transformed;
    }
    return await super.transform(value, metadata);
  }
}
