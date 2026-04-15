import { LanguagesEnum, PrismaClient } from '@prisma/client';
import { ListingFeaturesConfiguration } from '../src/dtos/jurisdictions/listing-features-config.dto';
import { RaceEthnicityConfiguration } from '../src/dtos/jurisdictions/race-ethnicity-configuration.dto';
import { createAllFeatureFlags } from './seed-helpers/feature-flag-factory';
import { translationFactory } from './seed-helpers/translation-factory';
import { unitTypeFactoryAll } from './seed-helpers/unit-type-factory';
import { userFactory } from './seed-helpers/user-factory';
import { createAngelopolisJurisdiction } from './seed-staging/seed-angelopolis';
import { createBloomingtonJurisdiction } from './seed-staging/seed-bloomington';
import { createBridgeBayJurisdictions } from './seed-staging/seed-bridge-bay';
import { createLakeviewJurisdiction } from './seed-staging/seed-lakeview';
import { createNadaHillJurisdiction } from './seed-staging/seed-nada-hill';

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

export const stagingSeed = async (
  prismaClient: PrismaClient,
  {
    jurisdictionName,
    publicSiteBaseURL,
    msqV2,
    asRegion = false,
  }: {
    jurisdictionName: string;
    publicSiteBaseURL: string;
    msqV2: boolean;
    asRegion: boolean;
  },
) => {
  // Seed feature flags
  await createAllFeatureFlags(prismaClient);

  const unitTypes = await unitTypeFactoryAll(prismaClient);

  // create a partner
  const partnerUser = await prismaClient.userAccounts.create({
    data: await userFactory({
      roles: { isPartner: true },
      email: 'partner@example.com',
      confirmedAt: new Date(),
      jurisdictionIds: [],
      acceptedTerms: true,
    }),
  });

  const allJurisdictions = [];
  let bridgeBayJurisdictions = [];
  let mainJurisdiction;
  if (asRegion) {
    bridgeBayJurisdictions = await createBridgeBayJurisdictions(prismaClient, {
      publicSiteBaseURL,
      msqV2,
    });
    allJurisdictions.push(
      ...bridgeBayJurisdictions.map((jurisdiction) => jurisdiction.id),
    );
    mainJurisdiction = bridgeBayJurisdictions[0];
  } else {
    mainJurisdiction = await createBloomingtonJurisdiction(prismaClient, {
      jurisdictionName,
      publicSiteBaseURL,
      unitTypes,
      partnerUser,
      msqV2,
    });
    const lakeviewJurisdiction = await createLakeviewJurisdiction(
      prismaClient,
      {
        publicSiteBaseURL,
        unitTypes,
        msqV2,
      },
    );
    const angelopolisJurisdiction = await createAngelopolisJurisdiction(
      prismaClient,
      { publicSiteBaseURL, unitTypes, partnerUser, msqV2 },
    );
    const nadaHill = await createNadaHillJurisdiction(prismaClient, {
      publicSiteBaseURL,
    });
    allJurisdictions.push(
      mainJurisdiction.id,
      lakeviewJurisdiction.id,
      nadaHill.id,
      angelopolisJurisdiction.id,
    );
  }

  // update the partner user to be associated with the jurisdiction(s)
  await prismaClient.userAccounts.update({
    where: { id: partnerUser.id },
    data: {
      jurisdictions: {
        connect: allJurisdictions.map((jurisdiction) => {
          return {
            id: jurisdiction,
          };
        }),
      },
    },
  });

  // create super admin user
  await prismaClient.userAccounts.create({
    data: await userFactory({
      roles: { isSuperAdmin: true, isAdmin: true },
      email: 'superadmin@example.com',
      confirmedAt: new Date(),
      jurisdictionIds: allJurisdictions,
      acceptedTerms: true,
      password: 'abcdef',
    }),
  });
  // create admin user
  await prismaClient.userAccounts.create({
    data: await userFactory({
      roles: { isAdmin: true },
      email: 'admin@example.com',
      confirmedAt: new Date(),
      jurisdictionIds: allJurisdictions,
      acceptedTerms: true,
      password: 'abcdef',
    }),
  });
  // create a support admin
  await prismaClient.userAccounts.create({
    data: await userFactory({
      roles: { isSupportAdmin: true },
      email: 'support-admin@example.com',
      confirmedAt: new Date(),
      acceptedTerms: true,
      jurisdictionIds: allJurisdictions,
    }),
  });
  // create a jurisdictional admin
  await prismaClient.userAccounts.create({
    data: await userFactory({
      roles: { isJurisdictionalAdmin: true },
      email: 'jurisdiction-admin@example.com',
      confirmedAt: new Date(),
      jurisdictionIds: [mainJurisdiction.id],
      acceptedTerms: true,
    }),
  });
  // create a limited jurisdictional admin
  await prismaClient.userAccounts.create({
    data: await userFactory({
      roles: { isLimitedJurisdictionalAdmin: true },
      email: 'limited-jurisdiction-admin@example.com',
      confirmedAt: new Date(),
      jurisdictionIds: [mainJurisdiction.id],
      acceptedTerms: true,
    }),
  });
  // create an unverified user
  await prismaClient.userAccounts.create({
    data: await userFactory({
      roles: { isAdmin: true },
      email: 'unverified@example.com',
      confirmedAt: new Date(),
      jurisdictionIds: allJurisdictions,
      acceptedTerms: false,
    }),
  });
  // create a user with mfa enabled
  await prismaClient.userAccounts.create({
    data: await userFactory({
      roles: { isAdmin: true },
      email: 'mfauser@bloom.com',
      confirmedAt: new Date(),
      jurisdictionIds: allJurisdictions,
      acceptedTerms: true,
      mfaEnabled: true,
      singleUseCode: '12345',
    }),
  });
  await prismaClient.userAccounts.create({
    data: await userFactory({
      email: 'public-user@example.com',
      confirmedAt: new Date(),
      jurisdictionIds: [mainJurisdiction.id],
      password: 'abcdef',
    }),
  });
  await prismaClient.userAccounts.create({
    data: await userFactory({
      roles: {
        isAdmin: false,
        isPartner: true,
        isJurisdictionalAdmin: false,
      },
      email: `partner-user@example.com`,
      confirmedAt: new Date(),
      jurisdictionIds: allJurisdictions,
      acceptedTerms: true,
    }),
  });

  // add jurisdiction specific translations and default ones
  await prismaClient.translations.create({
    data: translationFactory({
      jurisdiction: { id: mainJurisdiction.id, name: mainJurisdiction.name },
    }),
  });
  await prismaClient.translations.create({
    data: translationFactory({ language: LanguagesEnum.es }),
  });
  await prismaClient.translations.create({
    data: translationFactory(),
  });
};
