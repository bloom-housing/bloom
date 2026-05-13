import { PrismaClient } from '@prisma/client/extension';
import { JsonValue } from '@prisma/client/runtime/library';
import { ListingFeaturesConfiguration } from '../../src/dtos/jurisdictions/listing-features-config.dto';
import { RaceEthnicityConfiguration } from '../../src/dtos/jurisdictions/race-ethnicity-configuration.dto';
import { listingFactory } from '../seed-helpers/listing-factory';
import { userFactory } from '../seed-helpers/user-factory';

export const seedListings = async (
  prismaClient: PrismaClient,
  jurisdictionId: string,
  listingsToCreate: any[],
  amiChart?: {
    name: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    items: JsonValue;
    jurisdictionId: string;
  },
) => {
  for (const params of listingsToCreate) {
    const listing = await listingFactory(jurisdictionId, prismaClient, {
      amiChart,
      numberOfUnits: params.numberOfUnits,
      listing: params.listing,
      units: params.units,
      multiselectQuestions: params.multiselectQuestions,
      applications: params.applications,
      afsLastRunSetInPast: true,
      userAccounts: params.userAccounts,
      enableListingFeaturesAndUtilities:
        params.enableListingFeaturesAndUtilities,
    });
    const savedListing = await prismaClient.listings.create({ data: listing });
    await prismaClient.userAccounts.create({
      data: await userFactory({
        roles: {
          isAdmin: false,
          isPartner: true,
          isJurisdictionalAdmin: false,
        },
        email: `partner-user-${savedListing.name
          .toLowerCase()
          .replaceAll(' ', '-')}@example.com`,
        confirmedAt: new Date(),
        jurisdictionIds: [savedListing.jurisdictionId],
        acceptedTerms: true,
        listings: [savedListing.id],
      }),
    });

    console.log(`Added listing - ${savedListing.name}`);
  }
};

export const defaultRaceEthnicityConfiguration: RaceEthnicityConfiguration = {
  options: [
    {
      id: 'americanIndianAlaskanNative',
      subOptions: [],
      allowOtherText: false,
    },
    {
      id: 'asian',
      subOptions: [
        { id: 'asianIndian', allowOtherText: false },
        { id: 'chinese', allowOtherText: false },
        { id: 'filipino', allowOtherText: false },
        { id: 'japanese', allowOtherText: false },
        { id: 'korean', allowOtherText: false },
        { id: 'vietnamese', allowOtherText: false },
        { id: 'otherAsian', allowOtherText: true },
      ],
      allowOtherText: false,
    },
    {
      id: 'blackAfricanAmerican',
      subOptions: [],
      allowOtherText: false,
    },
    {
      id: 'nativeHawaiianOtherPacificIslander',
      subOptions: [
        { id: 'nativeHawaiian', allowOtherText: false },
        { id: 'guamanianOrChamorro', allowOtherText: false },
        { id: 'samoan', allowOtherText: false },
        { id: 'otherPacificIslander', allowOtherText: true },
      ],
      allowOtherText: false,
    },
    {
      id: 'white',
      subOptions: [],
      allowOtherText: false,
    },
    {
      id: 'otherMultiracial',
      subOptions: [],
      allowOtherText: true,
    },
    {
      id: 'declineToRespond',
      subOptions: [],
      allowOtherText: false,
    },
  ],
};
export const defaultListingFeatureConfiguration: ListingFeaturesConfiguration =
  {
    fields: [
      { id: 'wheelchairRamp' },
      { id: 'elevator' },
      { id: 'serviceAnimalsAllowed' },
      { id: 'accessibleParking' },
      { id: 'parkingOnSite' },
      { id: 'inUnitWasherDryer' },
      { id: 'laundryInBuilding' },
      { id: 'barrierFreeEntrance' },
      { id: 'rollInShower' },
      { id: 'grabBars' },
      { id: 'heatingInUnit' },
      { id: 'acInUnit' },
      { id: 'hearing' },
      { id: 'mobility' },
      { id: 'visual' },
      { id: 'barrierFreeUnitEntrance' },
      { id: 'loweredLightSwitch' },
      { id: 'barrierFreeBathroom' },
      { id: 'wideDoorways' },
      { id: 'loweredCabinets' },
    ],
  };
