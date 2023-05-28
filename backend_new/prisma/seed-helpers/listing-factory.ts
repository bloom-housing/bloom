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
} from '@prisma/client';
import { unitAccessibilityPriorityTypeFactory } from './unit-accessibility-priority-type-factory';
import { unitTypeFactory } from './unit-type-factory';
import { unitRentTypeFactory } from './unit-rent-type-factory';

export const listingFactory = (
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
          name: `reservedCommunityTypes: ${i} name: ${i}`,
          description: `reservedCommunityTypes: ${i} description: ${i}`,
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
            options: {},
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
            options: {},
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
  units: unitFactory(
    i,
    i,
    jurisdictionId,
    amiChartId,
    unitTypeId,
    unitAccessibilityPriorityTypeId,
    unitRentTypeId,
  ),
});

const unitFactory = (
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
      unitTypes: unitTypeId
        ? {
            connect: {
              id: unitTypeId,
            },
          }
        : { create: unitTypeFactory(i) },
      amiChart: amiChartId
        ? { connect: { id: amiChartId } }
        : {
            create: {
              items: {},
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
            create: unitAccessibilityPriorityTypeFactory(i),
          },
      unitRentTypes: unitRentTypeId
        ? { connect: { id: unitRentTypeId } }
        : {
            create: unitRentTypeFactory(i),
          },
    });
  }
  const toReturn: Prisma.UnitsCreateNestedManyWithoutListingsInput = {
    create: createArray,
  };

  return toReturn;
};
