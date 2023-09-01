import { ListingsStatusEnum } from '@prisma/client';
import { randomUUID } from 'crypto';
import {
  listingUrlSlug,
  listingUrlSlugHelper,
} from '../../../src/utilities/listing-url-slug';

const baseListingFields = {
  status: ListingsStatusEnum.active,
  displayWaitlistSize: false,
  showWaitlist: false,
  applicationMethods: [],
  referralApplication: undefined,
  assets: [],
  listingEvents: [],
  listingsBuildingAddress: undefined,
  jurisdictions: {
    id: randomUUID(),
  },
  units: [],
  id: randomUUID(),
  createdAt: new Date(),
  updatedAt: new Date(),
  urlSlug: '',
};

describe('Testing listing url slug builder', () => {
  it('should build a slug that is all lower case and special characters are removed', () => {
    expect(
      listingUrlSlug({
        name: 'ExampLe namE @ 17',
        ...baseListingFields,
      }),
    ).toEqual('examp_le_nam_e_17');
  });

  it('should build a slug that includes the address info', () => {
    expect(
      listingUrlSlug({
        ...baseListingFields,
        name: 'ExampLe namE @ 17',
        listingsBuildingAddress: {
          id: randomUUID(),
          createdAt: new Date(),
          updatedAt: new Date(),
          street: '11th Street',
          city: 'Phoenix',
          state: 'Az',
          zipCode: '87511',
        },
      }),
    ).toEqual('examp_le_nam_e_17_11_th_street_phoenix_az');
  });

  it('should build a slug from string', () => {
    expect(listingUrlSlugHelper('ExampLe namE @ 17')).toEqual(
      'examp_le_nam_e_17',
    );
  });

  it('should build a slug from array.join(" ")', () => {
    expect(
      listingUrlSlugHelper('ExampLe namE @ 17 11th street Phoenix Az 85711'),
    ).toEqual('examp_le_nam_e_17_11_th_street_phoenix_az_85711');
  });
});
