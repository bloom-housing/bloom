import { ArgumentMetadata, Injectable, ValidationPipe } from '@nestjs/common';
import { ListingUpdate } from '../dtos/listings/listing-update.dto';
import { ListingCreate } from '../dtos/listings/listing-create.dto';
import { PrismaService } from '../services/prisma.service';
import { defaultValidationPipeOptions } from '../utilities/default-validation-pipe-options';

/**
 * Validation pipe for creating or editing a listing
 * This does two steps:
 *  1. Select whether the validation DTO should be an update or create
 *  2. Add the required fields for the jurisdiction to the listing object.
 *     This can then be for the validate-listing-publish validate-units-require decorators
 */
@Injectable()
export class ListingCreateUpdateValidationPipe extends ValidationPipe {
  // Default required fields if jurisdiction doesn't specify any
  private defaultRequiredFields = [
    'listingsBuildingAddress',
    'name',
    'developer',
    'listingImages',
    'leasingAgentEmail',
    'leasingAgentName',
    'leasingAgentPhone',
    'jurisdictions',
    'units',
  ];

  constructor(private prisma: PrismaService) {
    super({
      ...defaultValidationPipeOptions,
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
    if (metadata.type !== 'body') {
      return await super.transform(value, metadata);
    }

    // For non-jurisdiction requests, use base validation
    if (!value.jurisdictions?.id) {
      return await super.transform(value, {
        ...metadata,
        metatype: value.id ? ListingUpdate : ListingCreate,
      });
    }

    // Get jurisdiction's listing configuration fields
    const jurisdiction = await this.prisma.jurisdictions.findFirst({
      where: { id: value.jurisdictions.id },
      select: {
        requiredListingFields: true,
        minimumListingPublishImagesRequired: true,
      },
    });

    // Use jurisdiction's required fields, falling back to defaults if none specified
    const requiredFields = jurisdiction?.requiredListingFields?.length
      ? jurisdiction.requiredListingFields
      : this.defaultRequiredFields;

    const minimumImagesRequired =
      jurisdiction?.minimumListingPublishImagesRequired || 0;

    // Add required fields to the value being validated
    const transformedValue = {
      ...value,
      units: value.units || [],
      unitGroups: value.unitGroups || [],
      requiredFields,
      minimumImagesRequired,
    };

    // Check for nested required fields
    // Only works when `requiredFields` property is in nested object dto
    const hasNestedRequired = requiredFields.some((f) => f.includes('.'));
    if (hasNestedRequired) {
      const relevantForPath = (path: string) =>
        (path
          ? requiredFields.filter((f) => f.startsWith(`${path}.`))
          : requiredFields
        )
          .map((f) => (path ? f.replace(`${path}.`, '') : f))
          .filter(Boolean);

      const injectRequiredFields = (node: any, path = '') => {
        if (!node) return;
        const currentRequired = relevantForPath(path);
        if (currentRequired.length === 0 && path) return;

        if (Array.isArray(node)) {
          node.forEach((item) => injectRequiredFields(item, path));
          return;
        }

        if (typeof node === 'object') {
          node.requiredFields ??= currentRequired;
          Object.entries(node).forEach(([key, child]) => {
            const childPath = path ? `${path}.${key}` : key;
            injectRequiredFields(child, childPath);
          });
        }
      };

      injectRequiredFields(transformedValue);
    }

    // Transform using the appropriate DTO with validation groups
    return await super.transform(transformedValue, {
      ...metadata,
      metatype: value.id ? ListingUpdate : ListingCreate,
    });
  }
}
