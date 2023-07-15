import {
  ListingsStatusEnum,
  MultiselectQuestionsApplicationSectionEnum,
  PrismaClient,
} from '@prisma/client';
import { userFactory } from './seed-helpers/user-factory';
import { jurisdictionFactory } from './seed-helpers/jurisdiction-factory';
import { amiChartFactory } from './seed-helpers/ami-chart-factory';
import { multiselectQuestionFactory } from './seed-helpers/multiselect-question-factory';
import { listingFactory } from './seed-helpers/listing-factory';
import { unitTypeFactoryAll } from './seed-helpers/unit-type-factory';
import { randomName } from './seed-helpers/word-generator';
import { randomInt } from 'node:crypto';

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
        numberOfOptions: index,
      }),
    });
  });
  return multiSelectQuestions;
};

export const devSeeding = async (prismaClient: PrismaClient) => {
  await prismaClient.userAccounts.create({
    data: userFactory({ isAdmin: true }),
  });
  const jurisdiction = await prismaClient.jurisdictions.create({
    data: jurisdictionFactory(),
  });
  await unitTypeFactoryAll(prismaClient);
  const amiChart = await prismaClient.amiChart.create({
    data: amiChartFactory(10, jurisdiction.id),
  });
  const multiselectQuestions = await Promise.all(
    await createMultiselect(jurisdiction.id, prismaClient),
  );

  [...new Array(5)].map(async (_, index) => {
    const listing = await listingFactory(jurisdiction.id, prismaClient, {
      amiChart: amiChart,
      numberOfUnits: index,
      includeBuildingFeatures: index > 1,
      includeEligibilityRules: index > 2,
      status: listingStatusEnumArray[randomInt(listingStatusEnumArray.length)],
      multiselectQuestions:
        index > 0 ? multiselectQuestions.slice(0, index - 1) : [],
    });
    await prismaClient.listings.create({
      data: listing,
    });
  });
};
