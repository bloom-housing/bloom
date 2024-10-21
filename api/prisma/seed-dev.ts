import {
  LanguagesEnum,
  ListingsStatusEnum,
  MultiselectQuestionsApplicationSectionEnum,
  PrismaClient,
} from '@prisma/client';
import { randomInt } from 'node:crypto';
import { APPLICATIONS_PER_LISTINGS, LISTINGS_TO_SEED } from './constants';
import { amiChartFactory } from './seed-helpers/ami-chart-factory';
import { applicationFactory } from './seed-helpers/application-factory';
import { householdMemberFactoryMany } from './seed-helpers/household-member-factory';
import { jurisdictionFactory } from './seed-helpers/jurisdiction-factory';
import { listingFactory } from './seed-helpers/listing-factory';
import { multiselectQuestionFactory } from './seed-helpers/multiselect-question-factory';
import { reservedCommunityTypeFactoryAll } from './seed-helpers/reserved-community-type-factory';
import { translationFactory } from './seed-helpers/translation-factory';
import { unitTypeFactoryAll } from './seed-helpers/unit-type-factory';
import { userFactory } from './seed-helpers/user-factory';
import { randomName } from './seed-helpers/word-generator';
const listingStatusEnumArray = Object.values(ListingsStatusEnum);
const createMultiselect = async (
  jurisdictionId: string,
  prismaClient: PrismaClient,
) => {
  const multiSelectQuestions = [...new Array(4)].map(async (_, index) => {
    return await prismaClient.multiselectQuestions.create({
      data: multiselectQuestionFactory(jurisdictionId, {
        multiselectQuestion: {
          text: randomName(),
          applicationSection:
            index % 2
              ? MultiselectQuestionsApplicationSectionEnum.preferences
              : MultiselectQuestionsApplicationSectionEnum.programs,
        },
        optOut: index > 1,
      }),
    });
  });
  return multiSelectQuestions;
};
export const devSeeding = async (
  prismaClient: PrismaClient,
  jurisdictionName?: string,
) => {
  const jurisdiction = await prismaClient.jurisdictions.create({
    data: {
      ...jurisdictionFactory(jurisdictionName),
      allowSingleUseCodeLogin: true,
    },
  });
  await prismaClient.userAccounts.create({
    data: await userFactory({
      roles: { isAdmin: true },
      email: 'admin@example.com',
      confirmedAt: new Date(),
      jurisdictionIds: [jurisdiction.id],
      acceptedTerms: true,
      password: 'abcdef',
    }),
  });
  await prismaClient.userAccounts.create({
    data: await userFactory({
      roles: { isAdmin: true },
      email: 'admin1@example.com',
      confirmedAt: new Date(),
      jurisdictionIds: [jurisdiction.id],
      acceptedTerms: true,
      password: 'abcdef',
    }),
  });
  await prismaClient.userAccounts.create({
    data: await userFactory({
      roles: { isAdmin: true },
      email: 'admin2@example.com',
      confirmedAt: new Date(),
      jurisdictionIds: [jurisdiction.id],
      acceptedTerms: true,
      password: 'abcdef',
    }),
  });
  await prismaClient.userAccounts.create({
    data: await userFactory({
      roles: { isAdmin: true },
      email: 'admin3@example.com',
      confirmedAt: new Date(),
      jurisdictionIds: [jurisdiction.id],
      acceptedTerms: true,
      password: 'abcdef',
    }),
  });
  await prismaClient.userAccounts.create({
    data: await userFactory({
      roles: { isAdmin: true },
      email: 'admin4@example.com',
      confirmedAt: new Date(),
      jurisdictionIds: [jurisdiction.id],
      acceptedTerms: true,
      password: 'abcdef',
    }),
  });
  await prismaClient.userAccounts.create({
    data: await userFactory({
      roles: { isAdmin: true },
      email: 'admin5@example.com',
      confirmedAt: new Date(),
      jurisdictionIds: [jurisdiction.id],
      acceptedTerms: true,
      password: 'abcdef',
    }),
  });
  await prismaClient.userAccounts.create({
    data: await userFactory({
      roles: { isAdmin: true },
      email: 'admin6@example.com',
      confirmedAt: new Date(),
      jurisdictionIds: [jurisdiction.id],
      acceptedTerms: true,
      password: 'abcdef',
    }),
  });
  await prismaClient.userAccounts.create({
    data: await userFactory({
      roles: { isAdmin: true },
      email: 'admin7@example.com',
      confirmedAt: new Date(),
      jurisdictionIds: [jurisdiction.id],
      acceptedTerms: true,
      password: 'abcdef',
    }),
  });
  await prismaClient.userAccounts.create({
    data: await userFactory({
      roles: { isAdmin: true },
      email: 'admin8@example.com',
      confirmedAt: new Date(),
      jurisdictionIds: [jurisdiction.id],
      acceptedTerms: true,
      password: 'abcdef',
    }),
  });
  await prismaClient.userAccounts.create({
    data: await userFactory({
      roles: { isAdmin: true },
      email: 'admin9@example.com',
      confirmedAt: new Date(),
      jurisdictionIds: [jurisdiction.id],
      acceptedTerms: true,
      password: 'abcdef',
    }),
  });
  await prismaClient.userAccounts.create({
    data: await userFactory({
      roles: { isAdmin: true },
      email: 'admin10@example.com',
      confirmedAt: new Date(),
      jurisdictionIds: [jurisdiction.id],
      acceptedTerms: true,
      password: 'abcdef',
    }),
  });
  await prismaClient.userAccounts.create({
    data: await userFactory({
      email: 'public-user@example.com',
      confirmedAt: new Date(),
      jurisdictionIds: [jurisdiction.id],
      password: 'abcdef',
    }),
  });
  await prismaClient.userAccounts.create({
    data: await userFactory({
      email: 'public-user@example.com',
      confirmedAt: new Date(),
      jurisdictionIds: [jurisdiction.id],
      password: 'abcdef',
    }),
  });
  await prismaClient.userAccounts.create({
    data: await userFactory({
      roles: { isJurisdictionalAdmin: true },
      email: 'jurisdiction-admin@example.com',
      confirmedAt: new Date(),
      jurisdictionIds: [jurisdiction.id],
    }),
  });
  await prismaClient.userAccounts.create({
    data: await userFactory({
      roles: { isLimitedJurisdictionalAdmin: true },
      email: 'limited-jurisdiction-admin@example.com',
      confirmedAt: new Date(),
      jurisdictionIds: [jurisdiction.id],
      acceptedTerms: true,
    }),
  });
  // add jurisdiction specific translations and default ones
  await prismaClient.translations.create({
    data: translationFactory(jurisdiction.id, jurisdiction.name),
  });
  await prismaClient.translations.create({
    data: translationFactory(undefined, undefined, LanguagesEnum.es),
  });
  await prismaClient.translations.create({
    data: translationFactory(),
  });
  const unitTypes = await unitTypeFactoryAll(prismaClient);
  const amiChart = await prismaClient.amiChart.create({
    data: amiChartFactory(10, jurisdiction.id),
  });
  const multiselectQuestions = await Promise.all(
    await createMultiselect(jurisdiction.id, prismaClient),
  );
  await reservedCommunityTypeFactoryAll(jurisdiction.id, prismaClient);
  for (let index = 0; index < LISTINGS_TO_SEED; index++) {
    const applications = [];
    for (let j = 0; j < APPLICATIONS_PER_LISTINGS; j++) {
      const householdSize = randomInt(1, 6);
      const householdMembers = await householdMemberFactoryMany(
        householdSize - 1,
      );
      const app = await applicationFactory({
        householdSize,
        unitTypeId: unitTypes[randomInt(0, 5)].id,
        householdMember: householdMembers,
        multiselectQuestions,
      });
      applications.push(app);
    }
    const listing = await listingFactory(jurisdiction.id, prismaClient, {
      amiChart: amiChart,
      numberOfUnits: index + 1,
      includeBuildingFeatures: index > 1,
      includeEligibilityRules: index > 2,
      status:
        index < 4
          ? ListingsStatusEnum.active
          : listingStatusEnumArray[
          index - 3 < listingStatusEnumArray.length
            ? index - 3
            : randomInt(listingStatusEnumArray.length - 1)
          ],
      multiselectQuestions:
        index > 0 ? multiselectQuestions.slice(0, index - 1) : [],
      applications,
      digitalApp: !!(index % 2),
    });
    await prismaClient.listings.create({
      data: listing,
    });
  }
};
