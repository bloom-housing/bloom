import {
  ListingsStatusEnum,
  ReviewOrderTypeEnum,
  Prisma,
  RegionEnum,
  ApplicationMethodsTypeEnum,
} from '@prisma/client';
import dayjs from 'dayjs';
import { yellowstoneAddress } from '../address-factory';

export const lakeviewVilla: Prisma.ListingsCreateInput = {
  additionalApplicationSubmissionNotes: null,
  digitalApplication: true,
  commonDigitalApplication: false,
  applicationMethods: {
    create: {
      type: ApplicationMethodsTypeEnum.ExternalLink,
      externalReference: 'https://example.com/application',
    },
  },
  paperApplication: false,
  referralOpportunity: false,
  assets: [],
  accessibility: null,
  amenities: null,
  buildingTotalUnits: 0,
  developer: 'Bloom',
  householdSizeMax: 0,
  householdSizeMin: 0,
  neighborhood: 'Greater Downtown area',
  region: RegionEnum.Greater_Downtown,
  petPolicy: null,
  smokingPolicy: null,
  unitAmenities: null,
  servicesOffered: null,
  yearBuilt: null,
  applicationDueDate: null,
  applicationOpenDate: dayjs(new Date()).subtract(70, 'days').toDate(),
  applicationFee: null,
  applicationOrganization: null,
  applicationPickUpAddressOfficeHours: null,
  applicationPickUpAddressType: null,
  applicationDropOffAddressOfficeHours: null,
  applicationDropOffAddressType: null,
  applicationMailingAddressType: null,
  buildingSelectionCriteria: null,
  costsNotIncluded: null,
  creditHistory: null,
  criminalBackground: null,
  depositMin: '0',
  depositMax: '0',
  depositHelperText:
    "or one month's rent may be higher for lower credit scores",
  disableUnitsAccordion: false,
  leasingAgentEmail: 'bloom@exygy.com',
  leasingAgentName: 'Bloom Bloomington',
  leasingAgentOfficeHours: null,
  leasingAgentPhone: '(313) 555-5555',
  leasingAgentTitle: null,
  name: 'Lakeview Villa',
  postmarkedApplicationsReceivedByDate: null,
  programRules: null,
  rentalAssistance:
    'Housing Choice Vouchers, Section 8 and other valid rental assistance programs will be considered for this property. In the case of a valid rental subsidy, the required minimum income will be based on the portion of the rent that the tenant pays after use of the subsidy.',
  rentalHistory: null,
  requiredDocuments: null,
  specialNotes: null,
  waitlistCurrentSize: null,
  waitlistMaxSize: null,
  whatToExpect:
    'Applicants will be contacted by the property agent in rank order until vacancies are filled. All of the information that you have provided will be verified and your eligibility confirmed. Your application will be removed from the waitlist if you have made any fraudulent statements. If we cannot verify a housing preference that you have claimed, you will not receive the preference but will not be otherwise penalized. Should your application be chosen, be prepared to fill out a more detailed application and provide required supporting documents.',
  status: ListingsStatusEnum.active,
  reviewOrderType: ReviewOrderTypeEnum.waitlist,
  unitsAvailable: 0,
  displayWaitlistSize: false,
  reservedCommunityDescription: null,
  reservedCommunityMinAge: null,
  resultLink: null,
  isWaitlistOpen: false,
  waitlistOpenSpots: null,
  customMapPin: false,
  contentUpdatedAt: new Date(),
  publishedAt: new Date(),
  listingsBuildingAddress: {
    create: yellowstoneAddress,
  },
  listingsApplicationPickUpAddress: undefined,
  listingsLeasingAgentAddress: undefined,
  listingsApplicationDropOffAddress: undefined,
  listingsApplicationMailingAddress: undefined,
  reservedCommunityTypes: undefined,
  listingImages: {
    create: {
      ordinal: 0,
      assets: {
        create: {
          label: 'cloudinaryBuilding',
          fileId: 'dev/unnamed_fkxrj2',
        },
      },
    },
  },
  listingNeighborhoodAmenities: {
    create: {
      groceryStores: 'There are grocery stores',
      pharmacies: 'There are pharmacies',
      healthCareResources: 'There is health care',
      parksAndCommunityCenters: 'There are parks',
      schools: 'There are schools',
      publicTransportation: 'There is public transportation',
    },
  },
};
