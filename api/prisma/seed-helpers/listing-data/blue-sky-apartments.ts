import {
  ApplicationAddressTypeEnum,
  ApplicationMethodsTypeEnum,
  HomeTypeEnum,
  ListingsStatusEnum,
  ReviewOrderTypeEnum,
} from '@prisma/client';
import dayjs from 'dayjs';
import {
  rockyMountainAddress,
  stagingRealisticAddresses,
  yosemiteAddress,
} from '../address-factory';

export const blueSkyApartments = {
  additionalApplicationSubmissionNotes: null,
  digitalApplication: true,
  commonDigitalApplication: true,
  paperApplication: true,
  referralOpportunity: false,
  assets: [],
  accessibility: null,
  amenities: null,
  buildingTotalUnits: 0,
  developer: 'Cielo Housing',
  householdSizeMax: 0,
  householdSizeMin: 0,
  neighborhood: 'North End',
  petPolicy: null,
  smokingPolicy: null,
  unitAmenities: null,
  servicesOffered: null,
  yearBuilt: 1900,
  applicationDueDate: null,
  applicationOpenDate: dayjs(new Date()).subtract(1, 'days').toDate(),
  applicationFee: '60',
  applicationOrganization: null,
  applicationPickUpAddressOfficeHours: null,
  applicationPickUpAddressType: ApplicationAddressTypeEnum.leasingAgent,
  applicationDropOffAddressOfficeHours: null,
  applicationDropOffAddressType: ApplicationAddressTypeEnum.leasingAgent,
  applicationMailingAddressType: ApplicationAddressTypeEnum.leasingAgent,
  applicationMethods: {
    create: {
      type: ApplicationMethodsTypeEnum.Internal,
    },
  },
  buildingSelectionCriteria: null,
  costsNotIncluded: null,
  creditHistory: null,
  criminalBackground: null,
  depositMin: '0',
  depositMax: '50',
  depositHelperText:
    "or one month's rent may be higher for lower credit scores",
  disableUnitsAccordion: false,
  homeType: HomeTypeEnum.apartment,
  leasingAgentEmail: 'joe@smithrealty.com',
  leasingAgentName: 'Joe Smith',
  leasingAgentOfficeHours: '9:00am - 5:00pm, Monday-Friday',
  leasingAgentPhone: '(773) 580-5897',
  leasingAgentTitle: 'Senior Leasing Agent',
  name: 'Blue Sky Apartments',
  postmarkedApplicationsReceivedByDate: '2025-06-06T23:00:00.000Z',
  programRules: null,
  rentalAssistance:
    'Housing Choice Vouchers, Section 8 and other valid rental assistance programs will be considered for this property. ',
  rentalHistory: null,
  requiredDocuments: null,
  specialNotes: null,
  waitlistCurrentSize: null,
  waitlistMaxSize: null,
  whatToExpect:
    'Applicants will be contacted by the property agent in rank order until vacancies are filled. All of the information that you have provided will be verified and your eligibility confirmed. Your application will be removed from the waitlist if you have made any fraudulent statements. If we cannot verify a housing preference that you have claimed, you will not receive the preference but will not be otherwise penalized. Should your application be chosen, be prepared to fill out a more detailed application and provide required supporting documents.',
  status: ListingsStatusEnum.active,
  reviewOrderType: ReviewOrderTypeEnum.firstComeFirstServe,
  displayWaitlistSize: false,
  reservedCommunityDescription:
    'Seniors over 55 are eligible for this property ',
  reservedCommunityMinAge: null,
  resultLink: null,
  isWaitlistOpen: false,
  waitlistOpenSpots: null,
  customMapPin: false,
  contentUpdatedAt: new Date(),
  publishedAt: new Date(),
  listingsBuildingAddress: {
    create: stagingRealisticAddresses[1],
  },
  listingsApplicationMailingAddress: {
    create: rockyMountainAddress,
  },
  listingsApplicationPickUpAddress: {
    create: yosemiteAddress,
  },
  listingsLeasingAgentAddress: {
    create: rockyMountainAddress,
  },
  listingsApplicationDropOffAddress: {
    create: yosemiteAddress,
  },
  reservedCommunityTypes: undefined,
  listingImages: {
    create: [
      {
        ordinal: 0,
        assets: {
          create: {
            label: 'cloudinaryBuilding',
            fileId: 'dev/trayan-xIOYJSVEZ8c-unsplash_f1axsg',
          },
        },
      },
    ],
  },
};
