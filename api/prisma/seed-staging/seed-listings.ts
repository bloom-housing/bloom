import { PrismaClient } from '@prisma/client/extension';
import { JsonValue } from '@prisma/client/runtime/library';
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
    console.log(`Adding listing - ${params.listing?.name}`);
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
  }
};
