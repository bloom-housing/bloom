import {
  ApplicationMethodsTypeEnum,
  ListingsStatusEnum,
  ReviewOrderTypeEnum,
} from '@prisma/client';
import dayjs from 'dayjs';
import { stagingRealisticAddresses } from '../address-factory';

export const valleyHeightsSeniorCommunity = {
  additionalApplicationSubmissionNotes: null,
  digitalApplication: true,
  commonDigitalApplication: true,
  paperApplication: false,
  referralOpportunity: false,
  assets: [],
  accessibility: null,
  amenities: 'Includes handicap accessible entry and parking spots. ',
  buildingTotalUnits: 17,
  developer: 'ABS Housing',
  householdSizeMax: 0,
  householdSizeMin: 0,
  neighborhood: null,
  petPolicy: null,
  smokingPolicy: 'No smoking is allowed on the property.',
  unitAmenities: null,
  servicesOffered: null,
  yearBuilt: 2019,
  applicationDueDate: null,
  applicationOpenDate: dayjs(new Date()).subtract(100, 'days').toDate(),
  applicationFee: '50',
  applicationOrganization: null,
  applicationPickUpAddressOfficeHours: null,
  applicationPickUpAddressType: null,
  applicationDropOffAddressOfficeHours: null,
  applicationDropOffAddressType: null,
  applicationMailingAddressType: null,
  applicationMethods: {
    create: {
      type: ApplicationMethodsTypeEnum.Internal,
    },
  },
  buildingSelectionCriteria: null,
  costsNotIncluded: 'Residents are responsible for gas and electric. ',
  creditHistory: null,
  criminalBackground: null,
  depositMin: '0',
  depositMax: '0',
  depositHelperText:
    "or one month's rent may be higher for lower credit scores",
  disableUnitsAccordion: false,
  leasingAgentEmail: 'valleysenior@vpm.com',
  leasingAgentName: 'Valley Property Management',
  leasingAgentOfficeHours: '10 am - 6 pm Monday through Friday',
  leasingAgentPhone: '(919) 999-9999',
  leasingAgentTitle: 'Property Manager',
  name: 'Valley Heights Senior Community',
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
  status: ListingsStatusEnum.closed,
  reviewOrderType: ReviewOrderTypeEnum.waitlist,
  displayWaitlistSize: false,
  reservedCommunityDescription:
    'Residents must be over the age of 55 at the time of move in.',
  reservedCommunityMinAge: null,
  resultLink: null,
  isWaitlistOpen: false,
  waitlistOpenSpots: null,
  customMapPin: false,
  contentUpdatedAt: dayjs(new Date()).subtract(1, 'days').toDate(),
  publishedAt: dayjs(new Date()).subtract(3, 'days').toDate(),
  closedAt: dayjs(new Date()).subtract(5, 'days').toDate(),
  // listingsBuildingAddress: {
  //   create: stagingRealisticAddresses[1],
  // },
  listingsApplicationPickUpAddress: undefined,
  listingsLeasingAgentAddress: undefined,
  listingsApplicationDropOffAddress: undefined,
  listingsApplicationMailingAddress: undefined,
  listingImages: {
    create: [
      {
        ordinal: 0,
        assets: {
          create: {
            label: 'cloudinaryBuilding',
            fileId: 'dev/apartment_ez3yyz',
          },
        },
      },
      {
        ordinal: 1,
        assets: {
          create: {
            label: 'cloudinaryBuilding',
            fileId: 'dev/interior_mc9erd',
          },
        },
      },
      {
        ordinal: 2,
        assets: {
          create: {
            label: 'cloudinaryBuilding',
            fileId: 'dev/inside_qo9wre',
          },
        },
      },
    ],
  },
};
