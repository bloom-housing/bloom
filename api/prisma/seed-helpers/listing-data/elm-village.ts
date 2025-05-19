import {
  ApplicationMethodsTypeEnum,
  ListingEventsTypeEnum,
  ListingsStatusEnum,
  ReviewOrderTypeEnum,
} from '@prisma/client';
import dayjs from 'dayjs';
import { featuresAndUtilites } from '../listing-factory';
import { stagingRealisticAddresses } from '../address-factory';

export const elmVillage = {
  additionalApplicationSubmissionNotes: null,
  digitalApplication: true,
  listingEvents: {
    create: [
      {
        type: ListingEventsTypeEnum.publicLottery,
        startDate: dayjs(new Date()).add(7, 'months').toDate(),
        startTime: dayjs(new Date()).add(7, 'months').add(1, 'hour').toDate(),
        endTime: dayjs(new Date()).add(7, 'months').add(2, 'hour').toDate(),
      },
    ],
  },
  commonDigitalApplication: true,
  paperApplication: false,
  referralOpportunity: false,
  assets: [],
  accessibility: null,
  amenities: null,
  buildingTotalUnits: 25,
  developer: 'Johnson Realtors',
  householdSizeMax: 0,
  householdSizeMin: 0,
  neighborhood: 'Hyde Park',
  petPolicy: null,
  smokingPolicy: null,
  unitAmenities: null,
  servicesOffered: null,
  yearBuilt: 1988,
  applicationMethods: {
    create: {
      type: ApplicationMethodsTypeEnum.Internal,
    },
  },
  applicationDueDate: dayjs(new Date()).add(6, 'months').toDate(),
  applicationOpenDate: dayjs(new Date()).subtract(1, 'days').toDate(),
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
  disableUnitsAccordion: true,
  leasingAgentEmail: 'jenny@gold.com',
  leasingAgentName: 'Jenny Gold',
  leasingAgentOfficeHours: null,
  leasingAgentPhone: '(208) 772-2856',
  leasingAgentTitle: 'Lead Agent',
  name: 'Elm Village',
  postmarkedApplicationsReceivedByDate: null,
  programRules: null,
  rentalAssistance:
    'Housing Choice Vouchers, Section 8 and other valid rental assistance programs will be considered for this property. In the case of a valid rental subsidy, the required minimum income will be based on the portion of the rent that the tenant pays after use of the subsidy.',
  rentalHistory: null,
  requiredDocuments: 'Please bring proof of income and a recent paystub.',
  specialNotes: null,
  waitlistCurrentSize: null,
  waitlistMaxSize: null,
  whatToExpect:
    'Applicants will be contacted by the property agent in rank order until vacancies are filled. All of the information that you have provided will be verified and your eligibility confirmed. Your application will be removed from the waitlist if you have made any fraudulent statements. If we cannot verify a housing preference that you have claimed, you will not receive the preference but will not be otherwise penalized. Should your application be chosen, be prepared to fill out a more detailed application and provide required supporting documents.',
  status: ListingsStatusEnum.active,
  reviewOrderType: ReviewOrderTypeEnum.lottery,
  lotteryOptIn: false,
  displayWaitlistSize: false,
  reservedCommunityDescription: null,
  reservedCommunityMinAge: null,
  resultLink: null,
  isWaitlistOpen: false,
  waitlistOpenSpots: null,
  customMapPin: false,
  contentUpdatedAt: new Date(),
  publishedAt: new Date(),
  // listingsBuildingAddress: {
  //   create: stagingRealisticAddresses[4],
  // },
  listingsApplicationPickUpAddress: undefined,
  listingsApplicationDropOffAddress: undefined,
  reservedCommunityTypes: undefined,
  ...featuresAndUtilites(),
  listingImages: {
    create: [
      {
        ordinal: 0,
        assets: {
          create: {
            label: 'cloudinaryBuilding',
            fileId: 'dev/krzysztof-hepner-V7Q0Oh3Az-c-unsplash_xoj7sr',
          },
        },
      },
      {
        ordinal: 1,
        assets: {
          create: {
            label: 'cloudinaryBuilding',
            fileId: 'dev/blake-wheeler-zBHU08hdzhY-unsplash_swqash',
          },
        },
      },
    ],
  },
};
