import { missingCategories } from '../../../src/decorators/validate-listing-features.decorator';
import { ListingFeaturesConfiguration } from '../../../src/dtos/jurisdictions/listing-features-config.dto';
import { ListingFeatures } from '@prisma/client';

describe('missingCategories', () => {
  it('should return an empty array when featuresConfiguration is undefined', () => {
    const value = {} as ListingFeatures;
    const result = missingCategories(undefined, value);
    expect(result).toEqual([]);
  });

  it('should return an empty array when featuresConfiguration has no categories', () => {
    const featuresConfiguration: ListingFeaturesConfiguration = {
      categories: [],
    };
    const value = {} as ListingFeatures;
    const result = missingCategories(featuresConfiguration, value);
    expect(result).toEqual([]);
  });

  it('should return an empty array when no categories are required', () => {
    const featuresConfiguration: ListingFeaturesConfiguration = {
      categories: [
        {
          id: 'mobility',
          fields: [{ id: 'wheelchairRamp' }],
          required: false,
        },
        {
          id: 'bathroom',
          fields: [{ id: 'accessibleHeightToilet' }],
          required: false,
        },
      ],
    };
    const value = {} as ListingFeatures;
    const result = missingCategories(featuresConfiguration, value);
    expect(result).toEqual([]);
  });

  it('should return an empty array when all required categories have at least one field set to true', () => {
    const featuresConfiguration: ListingFeaturesConfiguration = {
      categories: [
        {
          id: 'mobility',
          fields: [{ id: 'wheelchairRamp' }, { id: 'elevator' }],
          required: true,
        },
        {
          id: 'bathroom',
          fields: [{ id: 'accessibleHeightToilet' }],
          required: true,
        },
      ],
    };
    const value = {
      wheelchairRamp: true,
      elevator: false,
      accessibleHeightToilet: true,
    } as unknown as ListingFeatures;
    const result = missingCategories(featuresConfiguration, value);
    expect(result).toEqual([]);
  });

  it('should return category ids when required categories have no fields set to true', () => {
    const featuresConfiguration: ListingFeaturesConfiguration = {
      categories: [
        {
          id: 'mobility',
          fields: [{ id: 'wheelchairRamp' }, { id: 'elevator' }],
          required: true,
        },
        {
          id: 'bathroom',
          fields: [{ id: 'accessibleHeightToilet' }],
          required: true,
        },
      ],
    };
    const value = {
      wheelchairRamp: false,
      elevator: false,
      accessibleHeightToilet: false,
    } as unknown as ListingFeatures;
    const result = missingCategories(featuresConfiguration, value);
    expect(result).toEqual(['mobility', 'bathroom']);
  });

  it('should return only missing category ids when some required categories are satisfied', () => {
    const featuresConfiguration: ListingFeaturesConfiguration = {
      categories: [
        {
          id: 'mobility',
          fields: [{ id: 'wheelchairRamp' }, { id: 'elevator' }],
          required: true,
        },
        {
          id: 'bathroom',
          fields: [{ id: 'accessibleHeightToilet' }],
          required: true,
        },
        {
          id: 'hearingVision',
          fields: [{ id: 'brailleSignageInBuilding' }],
          required: true,
        },
      ],
    };
    const value = {
      wheelchairRamp: true,
      elevator: false,
      accessibleHeightToilet: false,
      brailleSignageInBuilding: false,
    } as unknown as ListingFeatures;
    const result = missingCategories(featuresConfiguration, value);
    expect(result).toEqual(['bathroom', 'hearingVision']);
  });

  it('should not include non-required categories in the result', () => {
    const featuresConfiguration: ListingFeaturesConfiguration = {
      categories: [
        {
          id: 'mobility',
          fields: [{ id: 'wheelchairRamp' }],
          required: true,
        },
        {
          id: 'hearingVision',
          fields: [{ id: 'brailleSignageInBuilding' }],
          required: false,
        },
      ],
    };
    const value = {
      wheelchairRamp: false,
      brailleSignageInBuilding: false,
    } as unknown as ListingFeatures;
    const result = missingCategories(featuresConfiguration, value);
    expect(result).toEqual(['mobility']);
  });

  it('should return true for a required category as long as one field is satisfied', () => {
    const featuresConfiguration: ListingFeaturesConfiguration = {
      categories: [
        {
          id: 'mobility',
          fields: [
            { id: 'wheelchairRamp' },
            { id: 'elevator' },
            { id: 'accessibleParking' },
          ],
          required: true,
        },
      ],
    };
    const value = {
      wheelchairRamp: false,
      elevator: true,
      accessibleParking: false,
    } as ListingFeatures;
    const result = missingCategories(featuresConfiguration, value);
    expect(result).toEqual([]);
  });

  it('should handle undefined field values as not true', () => {
    const featuresConfiguration: ListingFeaturesConfiguration = {
      categories: [
        {
          id: 'mobility',
          fields: [{ id: 'wheelchairRamp' }, { id: 'elevator' }],
          required: true,
        },
      ],
    };
    const value = {} as ListingFeatures;
    const result = missingCategories(featuresConfiguration, value);
    expect(result).toEqual(['mobility']);
  });

  it('should handle null field values as not true', () => {
    const featuresConfiguration: ListingFeaturesConfiguration = {
      categories: [
        {
          id: 'mobility',
          fields: [{ id: 'wheelchairRamp' }],
          required: true,
        },
      ],
    };
    const value = {
      wheelchairRamp: null,
    } as ListingFeatures;
    const result = missingCategories(featuresConfiguration, value);
    expect(result).toEqual(['mobility']);
  });
});
