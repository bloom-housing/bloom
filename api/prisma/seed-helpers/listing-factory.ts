import {
  Prisma,
  AmiChart,
  MultiselectQuestions,
  PrismaClient,
  ListingsStatusEnum,
} from '@prisma/client';
import { randomName } from './word-generator';
import { addressFactory } from './address-factory';
import { unitFactoryMany } from './unit-factory';
import { reservedCommunityTypeFactoryGet } from './reserved-community-type-factory';

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
  );
  return {
    createdAt: new Date(),
    assets: [],
    name: randomName(),
    status: optionalParams?.status || ListingsStatusEnum.active,
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
    reservedCommunityTypes: {
      connect: {
        id: reservedCommunityType.id,
      },
    },
    // For application flagged set tests the date needs to be before the updated timestamp
    // All others should be a newer timestamp so that they are not picked up by AFS tests
    afsLastRunAt: optionalParams?.afsLastRunSetInPast
      ? new Date(0)
      : new Date(),
    listingMultiselectQuestions: optionalParams?.multiselectQuestions
      ? {
          create: optionalParams.multiselectQuestions.map(
            (question, index) => ({
              multiselectQuestions: {
                connect: {
                  id: question.id,
                },
              },
              ordinal: index + 1,
            }),
          ),
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
    ...previousListing,
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
