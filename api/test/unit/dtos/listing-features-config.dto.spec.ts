import { ValidationPipe } from '@nestjs/common';
import { JurisdictionUpdate } from '../../../src/dtos/jurisdictions/jurisdiction-update.dto';
import { defaultValidationPipeOptions } from '../../../src/utilities/default-validation-pipe-options';
import { randomUUID } from 'crypto';

// The pipe validates with the default group, so a nested dto whose decorators declare no group
// has no constraints to run and class-validator reports the whole object as an unknown value.
const pipe = new ValidationPipe(defaultValidationPipeOptions);

const jurisdiction = (extra: Record<string, unknown>) => ({
  id: randomUUID(),
  name: 'Bloomington',
  languages: ['en'],
  publicUrl: 'http://example.com',
  emailFromAddress: 'a@example.com',
  rentalAssistanceDefault: 'x',
  partnerTerms: 'x',
  enablePartnerSettings: true,
  allowSingleUseCodeLogin: true,
  whatToExpect: 'x',
  whatToExpectAdditionalText: 'x',
  whatToExpectUnderConstruction: 'x',
  listingApprovalPermissions: [],
  duplicateListingPermissions: [],
  requiredListingFields: [],
  visibleNeighborhoodAmenities: [],
  visibleAccessibilityPriorityTypes: [],
  visibleApplicationAccessibilityFeatures: [],
  visibleSpokenLanguages: [],
  visibleHouseholdMemberRelationships: [],
  regions: [],
  ...extra,
});

const validate = (extra: Record<string, unknown>) =>
  pipe.transform(jurisdiction(extra), {
    type: 'body',
    metatype: JurisdictionUpdate,
  });

describe('jurisdiction listing features configuration', () => {
  it('accepts the flat field list a read returns', async () => {
    await expect(
      validate({
        listingFeaturesConfiguration: {
          fields: [{ id: 'wheelchairRamp' }, { id: 'elevator' }],
        },
      }),
    ).resolves.toBeDefined();
  });

  it('accepts categorized features', async () => {
    await expect(
      validate({
        listingFeaturesConfiguration: {
          categories: [
            {
              id: 'mobility',
              fields: [{ id: 'wheelchairRamp' }],
              required: true,
            },
          ],
        },
      }),
    ).resolves.toBeDefined();
  });

  it('still rejects a field whose id is not a string', async () => {
    await expect(
      validate({
        listingFeaturesConfiguration: { fields: [{ id: 5 }] },
      }),
    ).rejects.toThrow();
  });

  it('accepts a jurisdiction with no configuration', async () => {
    await expect(validate({})).resolves.toBeDefined();
  });
});
