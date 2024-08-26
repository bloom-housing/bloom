import {
  AmiChart,
  ApplicationMethodsTypeEnum,
  ListingsStatusEnum,
  LotteryStatusEnum,
  MultiselectQuestions,
  Prisma,
  PrismaClient,
  ReviewOrderTypeEnum,
} from '@prisma/client';
import { randomInt } from 'crypto';
import { randomName } from './word-generator';
import { addressFactory } from './address-factory';
import { unitFactoryMany } from './unit-factory';
import { reservedCommunityTypeFactoryGet } from './reserved-community-type-factory';

const cloudinaryIds = [
  'dev/blake-wheeler-zBHU08hdzhY-unsplash_swqash',
  'dev/krzysztof-hepner-V7Q0Oh3Az-c-unsplash_xoj7sr',
  'dev/dillon-kydd-2keCPb73aQY-unsplash_lm7krp',
  'dev/inside_qo9wre',
  'dev/interior_mc9erd',
  'dev/apartment_ez3yyz',
  'dev/trayan-xIOYJSVEZ8c-unsplash_f1axsg',
  'dev/apartment_building_2_b7ujdd',
];

export const listingFactory = async (
  jurisdictionId: string,
  prismaClient: PrismaClient,
  optionalParams?: {
    amiChart?: AmiChart;
    numberOfUnits?: number;
    status?: ListingsStatusEnum;
    units?: Prisma.UnitsCreateWithoutListingsInput[];
    listing?: Prisma.ListingsCreateInput;
    includeBuildingFeatures?: boolean;
    includeEligibilityRules?: boolean;
    multiselectQuestions?: Partial<MultiselectQuestions>[];
    applications?: Prisma.ApplicationsCreateInput[];
    applicationDueDate?: Date;
    afsLastRunSetInPast?: boolean;
    reservedCommunityType?: string;
    digitalApp?: boolean;
    noImage?: boolean;
    lotteryStatus?: LotteryStatusEnum;
    closedAt?: Date;
    reviewOrderType?: ReviewOrderTypeEnum;
    listingEvents?: Prisma.ListingEventsCreateWithoutListingsInput[];
    lotteryOptIn?: boolean;
  },
): Promise<Prisma.ListingsCreateInput> => {
  const previousListing = optionalParams?.listing || {};
  let units = optionalParams?.units;
  if (!units && optionalParams?.numberOfUnits) {
    units = await unitFactoryMany(optionalParams.numberOfUnits, prismaClient, {
      randomizePriorityType: true,
      amiChart: optionalParams?.amiChart,
    });
  }
  const reservedCommunityType = await reservedCommunityTypeFactoryGet(
    prismaClient,
    jurisdictionId,
    optionalParams?.reservedCommunityType,
  );

  const digitalApp = optionalParams?.digitalApp ?? Math.random() < 0.5;

  return {
    createdAt: new Date(),
    assets: [],
    name: randomName(),
    status: optionalParams?.status || ListingsStatusEnum.active,
    closedAt: optionalParams?.closedAt
      ? optionalParams?.closedAt
      : optionalParams?.status === ListingsStatusEnum.closed
      ? new Date()
      : null,
    lotteryStatus: optionalParams?.lotteryStatus || undefined,
    lotteryOptIn: optionalParams?.lotteryOptIn || undefined,
    displayWaitlistSize: Math.random() < 0.5,
    listingsBuildingAddress: {
      create: addressFactory(),
    },
    listingsApplicationMailingAddress: {
      create: addressFactory(),
    },
    listingsApplicationPickUpAddress: {
      create: addressFactory(),
    },
    listingsLeasingAgentAddress: {
      create: addressFactory(),
    },
    listingsApplicationDropOffAddress: {
      create: addressFactory(),
    },
    reservedCommunityTypes:
      Math.random() < 0.5
        ? {
            connect: {
              id: reservedCommunityType.id,
            },
          }
        : {},
    // For application flagged set tests the date needs to be before the updated timestamp
    // All others should be a newer timestamp so that they are not picked up by AFS tests
    afsLastRunAt: optionalParams?.afsLastRunSetInPast
      ? new Date(0)
      : new Date(),
    listingMultiselectQuestions: optionalParams?.multiselectQuestions
      ? {
          create: [
            ...optionalParams?.multiselectQuestions
              ?.filter(
                (question) => question.applicationSection === 'preferences',
              )
              .map((question, index) => ({
                multiselectQuestions: {
                  connect: {
                    id: question.id,
                  },
                },
                ordinal: index + 1,
              })),
            ...optionalParams?.multiselectQuestions
              ?.filter((question) => question.applicationSection === 'programs')
              .map((question, index) => ({
                multiselectQuestions: {
                  connect: {
                    id: question.id,
                  },
                },
                ordinal: index + 1,
              })),
          ],
        }
      : undefined,
    applications: optionalParams?.applications
      ? {
          create: optionalParams.applications,
        }
      : undefined,
    unitsAvailable: units?.length || 0,
    ...featuresAndUtilites(),
    ...buildingFeatures(optionalParams?.includeBuildingFeatures),
    ...additionalEligibilityRules(optionalParams?.includeEligibilityRules),
    jurisdictions: {
      connect: {
        id: jurisdictionId,
      },
    },
    units: units
      ? {
          create: units,
        }
      : undefined,
    applicationDueDate: optionalParams?.applicationDueDate ?? undefined,
    reviewOrderType: optionalParams?.reviewOrderType ?? undefined,
    developer: randomName(),
    leasingAgentName: randomName(),
    leasingAgentEmail: 'leasing-agent@example.com',
    leasingAgentPhone: '515-604-0183',
    digitalApplication: digitalApp,
    commonDigitalApplication: digitalApp,
    paperApplication: Math.random() < 0.5,
    referralOpportunity: Math.random() < 0.5,
    applicationMethods: digitalApp
      ? {
          create: {
            type: ApplicationMethodsTypeEnum.Internal,
          },
        }
      : {},
    listingImages: !optionalParams?.noImage
      ? {
          create: {
            ordinal: 0,
            assets: {
              create: {
                label: 'cloudinaryBuilding',
                fileId: cloudinaryIds[randomInt(cloudinaryIds.length)],
              },
            },
          },
        }
      : {},
    listingEvents: optionalParams?.listingEvents
      ? {
          create: optionalParams.listingEvents,
        }
      : undefined,
    ...previousListing,
  };
};

const buildingFeatures = (includeBuildingFeatures: boolean) => {
  if (!includeBuildingFeatures) return {};
  return {
    amenities:
      'Laundry facilities, Elevators, Beautifully landscaped garden, walkways',
    unitAmenities: 'All-electric kitchen, Dishwasher',
    petPolicy: 'Allow pets with a deposit of $500',
    accessibility: 'ADA units available',
    smokingPolicy: 'Non-smoking building',
    servicesOffered: 'Resident services on-site.',
  };
};

const additionalEligibilityRules = (includeEligibilityRules: boolean) => {
  if (!includeEligibilityRules) return {};
  return {
    rentalHistory: 'Two years of rental history will be verified',
    rentalAssistance: 'additional rental assistance',
    creditHistory:
      'A poor credit history may be grounds to deem an applicant ineligible for housing.',
    criminalBackground:
      'A criminal background investigation will be obtained on each applicant.  As criminal background checks are done county by county and will be ran for all counties in which the applicant lived,  Applicants will be disqualified for tenancy if they have been convicted of a felony or misdemeanor.  Refer to Tenant Selection Criteria or Qualification Criteria for details related to the qualification process. ',
  };
};

export const featuresAndUtilites = (): {
  listingFeatures: Prisma.ListingFeaturesCreateNestedOneWithoutListingsInput;
  listingUtilities: Prisma.ListingUtilitiesCreateNestedOneWithoutListingsInput;
} => ({
  listingFeatures: {
    create: {
      elevator: true,
      wheelchairRamp: true,
      serviceAnimalsAllowed: true,
      accessibleParking: true,
      parkingOnSite: true,
      inUnitWasherDryer: true,
      laundryInBuilding: true,
      barrierFreeEntrance: true,
      rollInShower: true,
      grabBars: true,
      heatingInUnit: true,
      acInUnit: true,
      hearing: true,
      visual: true,
      mobility: true,
      barrierFreeUnitEntrance: true,
      loweredLightSwitch: true,
      barrierFreeBathroom: true,
      wideDoorways: true,
      loweredCabinets: true,
    },
  },
  listingUtilities: {
    create: {
      water: true,
      gas: true,
      trash: true,
      sewer: true,
      electricity: true,
      cable: true,
      phone: true,
      internet: true,
    },
  },
});
