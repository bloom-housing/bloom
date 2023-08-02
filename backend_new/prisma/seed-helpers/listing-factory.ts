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
import { reservedCommunityTypeFactory } from './reserved-community-type-factory';
import { multiselectQuestionFactory } from './multiselect-question-factory';

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
      create: reservedCommunityTypeFactory(jurisdictionId),
    },
    listingMultiselectQuestions: optionalParams?.multiselectQuestions
      ? {
          create: optionalParams.multiselectQuestions.map((question) => ({
            multiselectQuestions: {
              create: multiselectQuestionFactory(jurisdictionId, {
                multiselectQuestion: { text: question.text },
              }),
            },
          })),
        }
      : undefined,
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

// Tables that aren't currently used by bloom but are getting set.
// Setting all fields to false for now
const featuresAndUtilites = () => ({
  listingFeatures: {
    create: {
      elevator: false,
      wheelchairRamp: false,
      serviceAnimalsAllowed: false,
      accessibleParking: false,
      parkingOnSite: false,
      inUnitWasherDryer: false,
      laundryInBuilding: false,
      barrierFreeEntrance: false,
      rollInShower: false,
      grabBars: false,
      heatingInUnit: false,
      acInUnit: false,
      hearing: false,
      visual: false,
      mobility: false,
      barrierFreeUnitEntrance: false,
      loweredLightSwitch: false,
      barrierFreeBathroom: false,
      wideDoorways: false,
      loweredCabinets: false,
    },
  },
  listingUtilities: {
    create: {
      water: false,
      gas: false,
      trash: false,
      sewer: false,
      electricity: false,
      cable: false,
      phone: false,
      internet: false,
    },
  },
});
