import {
  Prisma,
  ApplicationAddressTypeEnum,
  ListingsStatusEnum,
  ReviewOrderTypeEnum,
  MarketingTypeEnum,
  MarketingSeasonEnum,
  HomeTypeEnum,
  RegionEnum,
  ApplicationMethodsTypeEnum,
  ListingEventsTypeEnum,
  MultiselectQuestionsApplicationSectionEnum,
  UnitsStatusEnum,
  AmiChart,
  MultiselectQuestions,
  PrismaClient,
} from '@prisma/client';
import { unitRentTypeFactory } from './unit-rent-type-factory';
import { unitAccessibilityPriorityTypeFactorySingle } from './unit-accessibility-priority-type-factory';
import { randomName } from './word-generator';
import { addressFactory } from './address-factory';
import { unitFactoryMany } from './unit-factory';
import { reservedCommunityTypeFactory } from './reserved-community-type-factory';

export const listingFactory = async (
  jurisdictionId: string,
  prismaClient: PrismaClient,
  optionalParams?: {
    amiChart?: AmiChart;
    numberOfUnits?: number;
    units?: Prisma.UnitsCreateWithoutListingsInput[];
    listing?: Prisma.ListingsCreateInput;
    includeBuildingFeatures?: boolean;
    includeEligibilityRules?: boolean;
    multiselectQuestions?: MultiselectQuestions[];
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
          create: optionalParams.multiselectQuestions.map(
            (question, index) => ({
              ordinal: index,
              multiselectQuestionId: question.id,
            }),
          ),
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

// Temporarily keeping this for reference
export const listingFactory2 = (
  i: number,
  jurisdictionId: string,
  amiChartId?: string,
  reservedCommunityTypeId?: string,
  unitTypeId?: string,
  unitAccessibilityPriorityTypeId?: string,
  unitRentTypeId?: string,
): Prisma.ListingsCreateInput => ({
  additionalApplicationSubmissionNotes: `additionalApplicationSubmissionNotes: ${i}`,
  digitalApplication: true,
  commonDigitalApplication: true,
  paperApplication: false,
  referralOpportunity: true,
  assets: '',
  accessibility: `accessibility: ${i}`,
  amenities: `amenities: ${i}`,
  buildingTotalUnits: i,
  developer: `developer: ${i}`,
  householdSizeMax: 1,
  householdSizeMin: i,
  neighborhood: `neighborhood: ${i}`,
  petPolicy: `petPolicy: ${i}`,
  smokingPolicy: `smokingPolicy: ${i}`,
  unitsAvailable: i - 1,
  unitAmenities: `unitAmenities: ${i}`,
  servicesOffered: `servicesOffered: ${i}`,
  yearBuilt: 2000 + i,
  applicationDueDate: new Date(),
  applicationOpenDate: new Date(),
  applicationFee: `applicationFee: ${i}`,
  applicationOrganization: `applicationOrganization: ${i}`,
  applicationPickUpAddressOfficeHours: `applicationPickUpAddressOfficeHours: ${i}`,
  applicationPickUpAddressType: ApplicationAddressTypeEnum.leasingAgent,
  applicationDropOffAddressOfficeHours: `applicationDropOffAddressOfficeHours: ${i}`,
  applicationDropOffAddressType: ApplicationAddressTypeEnum.leasingAgent,
  applicationMailingAddressType: ApplicationAddressTypeEnum.leasingAgent,
  buildingSelectionCriteria: `buildingSelectionCriteria: ${i}`,
  costsNotIncluded: `costsNotIncluded: ${i}`,
  creditHistory: `creditHistory: ${i}`,
  criminalBackground: `criminalBackground: ${i}`,
  depositMin: `depositMin: ${i}`,
  depositMax: `depositMax: ${i}`,
  depositHelperText: `depositHelperText: ${i}`,
  disableUnitsAccordion: true,
  leasingAgentEmail: `leasingAgentEmail: ${i}`,
  leasingAgentName: `leasingAgentName: ${i}`,
  leasingAgentOfficeHours: `leasingAgentOfficeHours: ${i}`,
  leasingAgentPhone: `leasingAgentPhone: ${i}`,
  leasingAgentTitle: `leasingAgentTitle: ${i}`,
  name: `name: ${i}`,
  postmarkedApplicationsReceivedByDate: new Date(),
  programRules: `programRules: ${i}`,
  rentalAssistance: `rentalAssistance: ${i}`,
  rentalHistory: `rentalHistory: ${i}`,
  requiredDocuments: `requiredDocuments: ${i}`,
  specialNotes: `specialNotes: ${i}`,
  waitlistCurrentSize: i,
  waitlistMaxSize: i + 1,
  whatToExpect: `whatToExpect: ${i}`,
  status: ListingsStatusEnum.active,
  reviewOrderType: ReviewOrderTypeEnum.firstComeFirstServe,
  displayWaitlistSize: true,
  reservedCommunityDescription: `reservedCommunityDescription: ${i}`,
  reservedCommunityMinAge: i * 10,
  resultLink: `resultLink: ${i}`,
  isWaitlistOpen: true,
  waitlistOpenSpots: i,
  customMapPin: false,
  publishedAt: new Date(),

  closedAt: new Date(),
  afsLastRunAt: null,
  lastApplicationUpdateAt: new Date(),
  listingsBuildingAddress: {
    create: {
      placeName: `listingsBuildingAddress: ${i} placeName: ${i}`,
      city: `listingsBuildingAddress: ${i} city: ${i}`,
      county: `listingsBuildingAddress: ${i} county: ${i}`,
      state: `listingsBuildingAddress: ${i} state: ${i}`,
      street: `listingsBuildingAddress: ${i} street: ${i}`,
      street2: `listingsBuildingAddress: ${i} street2: ${i}`,
      zipCode: `listingsBuildingAddress: ${i} zipCode: ${i}`,
      latitude: i * 100,
      longitude: i * 101,
    },
  },
  listingsApplicationDropOffAddress: {
    create: {
      placeName: `listingsApplicationDropOffAddress: ${i} placeName: ${i}`,
      city: `listingsApplicationDropOffAddress: ${i} city: ${i}`,
      county: `listingsApplicationDropOffAddress: ${i} county: ${i}`,
      state: `listingsApplicationDropOffAddress: ${i} state: ${i}`,
      street: `listingsApplicationDropOffAddress: ${i} street: ${i}`,
      street2: `listingsApplicationDropOffAddress: ${i} street2: ${i}`,
      zipCode: `listingsApplicationDropOffAddress: ${i} zipCode: ${i}`,
      latitude: i * 100,
      longitude: i * 101,
    },
  },
  listingsApplicationMailingAddress: {
    create: {
      placeName: `listingsApplicationMailingAddress: ${i} placeName: ${i}`,
      city: `listingsApplicationMailingAddress: ${i} city: ${i}`,
      county: `listingsApplicationMailingAddress: ${i} county: ${i}`,
      state: `listingsApplicationMailingAddress: ${i} state: ${i}`,
      street: `listingsApplicationMailingAddress: ${i} street: ${i}`,
      street2: `listingsApplicationMailingAddress: ${i} street2: ${i}`,
      zipCode: `listingsApplicationMailingAddress: ${i} zipCode: ${i}`,
      latitude: i * 100,
      longitude: i * 101,
    },
  },
  listingsLeasingAgentAddress: {
    create: {
      placeName: `listingsLeasingAgentAddress: ${i} placeName: ${i}`,
      city: `listingsLeasingAgentAddress: ${i} city: ${i}`,
      county: `listingsLeasingAgentAddress: ${i} county: ${i}`,
      state: `listingsLeasingAgentAddress: ${i} state: ${i}`,
      street: `listingsLeasingAgentAddress: ${i} street: ${i}`,
      street2: `listingsLeasingAgentAddress: ${i} street2: ${i}`,
      zipCode: `listingsLeasingAgentAddress: ${i} zipCode: ${i}`,
      latitude: i * 100,
      longitude: i * 101,
    },
  },
  listingsApplicationPickUpAddress: {
    create: {
      placeName: `listingsApplicationPickUpAddress: ${i} placeName: ${i}`,
      city: `listingsApplicationPickUpAddress: ${i} city: ${i}`,
      county: `listingsApplicationPickUpAddress: ${i} county: ${i}`,
      state: `listingsApplicationPickUpAddress: ${i} state: ${i}`,
      street: `listingsApplicationPickUpAddress: ${i} street: ${i}`,
      street2: `listingsApplicationPickUpAddress: ${i} street2: ${i}`,
      zipCode: `listingsApplicationPickUpAddress: ${i} zipCode: ${i}`,
      latitude: i * 100,
      longitude: i * 101,
    },
  },
  listingsBuildingSelectionCriteriaFile: {
    create: {
      label: `listingsBuildingSelectionCriteriaFile: ${i} label: ${i}`,
      fileId: `listingsBuildingSelectionCriteriaFile: ${i} fileId: ${i}`,
    },
  },
  jurisdictions: {
    connect: {
      id: jurisdictionId,
    },
  },
  reservedCommunityTypes: reservedCommunityTypeId
    ? { connect: { id: reservedCommunityTypeId } }
    : {
        create: {
          name: `reservedCommunityType: ${i}`,
          description: `description: ${i}`,
          jurisdictions: {
            connect: {
              id: jurisdictionId,
            },
          },
        },
      },
  listingsResult: {
    create: {
      label: `listingsResult: ${i} label: ${i}`,
      fileId: `listingsResult: ${i} fileId: ${i}`,
    },
  },
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

  // detroit specific
  hrdId: `hrdId: ${i}`,
  ownerCompany: `ownerCompany: ${i}`,
  managementCompany: `managementCompany: ${i}`,
  managementWebsite: `managementWebsite: ${i}`,
  amiPercentageMin: i,
  amiPercentageMax: i,
  phoneNumber: `phoneNumber: ${i}`,
  temporaryListingId: i,
  isVerified: true,
  marketingType: MarketingTypeEnum.marketing,
  marketingDate: new Date(),
  marketingSeason: MarketingSeasonEnum.summer,
  whatToExpectAdditionalText: `whatToExpectAdditionalText: ${i}`,
  section8Acceptance: true,
  listingNeighborhoodAmenities: {
    create: {
      groceryStores: `listingNeighborhoodAmenities: ${i} groceryStores: ${i}`,
      pharmacies: `listingNeighborhoodAmenities: ${i} pharmacies: ${i}`,
      healthCareResources: `listingNeighborhoodAmenities: ${i} healthCareResources: ${i}`,
      parksAndCommunityCenters: `listingNeighborhoodAmenities: ${i} parksAndCommunityCenters: ${i}`,
      schools: `listingNeighborhoodAmenities: ${i} schools: ${i}`,
      publicTransportation: `listingNeighborhoodAmenities: ${i} publicTransportation: ${i}`,
    },
  },
  verifiedAt: new Date(),
  homeType: HomeTypeEnum.apartment,
  region: RegionEnum.Greater_Downtown,
  // end detroit specific

  applicationMethods: {
    create: {
      type: ApplicationMethodsTypeEnum.Internal,
      label: `applicationMethods: ${i} label: ${i}`,
      externalReference: `applicationMethods: ${i} externalReference: ${i}`,
      acceptsPostmarkedApplications: true,
      phoneNumber: `applicationMethods: ${i} phoneNumber: ${i}`,
    },
  },
  listingEvents: {
    create: {
      type: ListingEventsTypeEnum.publicLottery,
      startDate: new Date(),
      startTime: new Date(),
      endTime: new Date(),
      url: `listingEvents: ${i} url: ${i}`,
      note: `listingEvents: ${i} note: ${i}`,
      label: `listingEvents: ${i} label: ${i}`,
      assets: {
        create: {
          label: `listingEvents: ${i} label: ${i}`,
          fileId: `listingEvents: ${i} fileId: ${i}`,
        },
      },
    },
  },
  listingImages: {
    create: {
      ordinal: 1,
      assets: {
        create: {
          label: `listingImages: ${i} label: ${i}`,
          fileId: `listingImages: ${i} fileId: ${i}`,
        },
      },
    },
  },
  listingMultiselectQuestions: {
    create: [
      {
        ordinal: 1,
        multiselectQuestions: {
          create: {
            text: `multiselectQuestions: ${i} text: ${i}`,
            subText: `multiselectQuestions: ${i} subText: ${i}`,
            description: `multiselectQuestions: ${i} description: ${i}`,
            links: {},
            options: [
              { text: `multiselectQuestions: ${i} option: ${i}`, ordinal: 1 },
            ],
            optOutText: `multiselectQuestions: ${i} optOutText: ${i}`,
            hideFromListing: true,
            applicationSection:
              MultiselectQuestionsApplicationSectionEnum.programs,
            jurisdictions: {
              connect: {
                id: jurisdictionId,
              },
            },
          },
        },
      },
      {
        ordinal: 2,
        multiselectQuestions: {
          create: {
            text: `multiselectQuestions: ${i} text: ${i}`,
            subText: `multiselectQuestions: ${i} subText: ${i}`,
            description: `multiselectQuestions: ${i} description: ${i}`,
            links: {},
            options: [],
            optOutText: `multiselectQuestions: ${i} optOutText: ${i}`,
            hideFromListing: true,
            applicationSection:
              MultiselectQuestionsApplicationSectionEnum.preferences,
            jurisdictions: {
              connect: {
                id: jurisdictionId,
              },
            },
          },
        },
      },
    ],
  },
  units: unitFactory2(
    i,
    i,
    jurisdictionId,
    amiChartId,
    unitTypeId,
    unitAccessibilityPriorityTypeId,
    unitRentTypeId,
  ),
});

// Temporarily keeping this for reference
const unitFactory2 = (
  numberToMake: number,
  i: number,
  jurisdictionId: string,
  amiChartId?: string,
  unitTypeId?: string,
  unitAccessibilityPriorityTypeId?: string,
  unitRentTypeId?: string,
): Prisma.UnitsCreateNestedManyWithoutListingsInput => {
  const createArray: Prisma.UnitsCreateWithoutListingsInput[] = [];
  for (let j = 0; j < numberToMake; j++) {
    createArray.push({
      amiPercentage: `${i}`,
      annualIncomeMin: `${i}`,
      monthlyIncomeMin: `${i}`,
      floor: i,
      annualIncomeMax: `${i}`,
      maxOccupancy: i,
      minOccupancy: i,
      monthlyRent: `${i}`,
      numBathrooms: i,
      numBedrooms: i,
      number: `listing: ${i} unit: ${j}`,
      sqFeet: i,
      monthlyRentAsPercentOfIncome: i,
      bmrProgramChart: true,
      status: UnitsStatusEnum.available,
      // unitTypes: unitTypeId
      //   ? {
      //       connect: {
      //         id: unitTypeId,
      //       },
      //     }
      //   : { create: unitTypeFactory(i) },
      amiChart: amiChartId
        ? { connect: { id: amiChartId } }
        : {
            create: {
              items: [],
              name: `listing: ${i} unit: ${j} amiChart: ${j}`,
              jurisdictions: {
                connect: {
                  id: jurisdictionId,
                },
              },
            },
          },
      unitAccessibilityPriorityTypes: unitAccessibilityPriorityTypeId
        ? { connect: { id: unitAccessibilityPriorityTypeId } }
        : {
            create: unitAccessibilityPriorityTypeFactorySingle(),
          },
      unitRentTypes: unitRentTypeId
        ? { connect: { id: unitRentTypeId } }
        : {
            create: unitRentTypeFactory(),
          },
    });
  }
  const toReturn: Prisma.UnitsCreateNestedManyWithoutListingsInput = {
    create: createArray,
  };

  return toReturn;
};
