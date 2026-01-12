import {
  MultiselectQuestionsApplicationSectionEnum,
  MultiselectQuestionsStatusEnum,
  Prisma,
} from '@prisma/client';
import { randomName, randomNoun } from './word-generator';
import { randomInt } from 'crypto';

const multiselectAppSectionAsArray = Object.values(
  MultiselectQuestionsApplicationSectionEnum,
);

export const multiselectQuestionFactory = (
  jurisdictionId: string,
  optionalParams?: {
    optOut?: boolean;
    multiselectQuestion?: Partial<Prisma.MultiselectQuestionsCreateInput>;
  },
  version2 = false,
): Prisma.MultiselectQuestionsCreateInput => {
  const previousMultiselectQuestion = optionalParams?.multiselectQuestion || {};
  const name = optionalParams?.multiselectQuestion?.name || randomName();
  const text = optionalParams?.multiselectQuestion?.text || randomName();
  const baseFields = {
    applicationSection:
      optionalParams?.multiselectQuestion?.applicationSection ||
      multiselectAppSectionAsArray[
        randomInt(multiselectAppSectionAsArray.length)
      ],
    hideFromListing: false,
    jurisdiction: {
      connect: {
        id: jurisdictionId,
      },
    },
    links: [],
  };

  const v1Fields = {
    description: `description of ${text}`,
    isExclusive: false,
    name: text,
    options: multiselectOptionFactory(randomInt(1, 3)),
    optOutText: optionalParams?.optOut ? "I don't want this preference" : null,
    status: MultiselectQuestionsStatusEnum.draft,
    subText: `sub text for ${text}`,
    text: text,
  };
  const v2Fields = {
    description: `description of ${name}`,
    isExclusive: optionalParams?.multiselectQuestion?.isExclusive ?? false,
    multiselectOptions: {
      createMany: {
        data: multiselectOptionFactoryV2(randomInt(1, 3)),
      },
    },
    name: name,
    subText: `sub text for ${name}`,
    status: MultiselectQuestionsStatusEnum.draft,
    // TODO: Can be removed after MSQ refactor
    text: name,
  };

  if (version2) {
    return {
      ...v2Fields,
      ...previousMultiselectQuestion,
      ...baseFields,
    };
  }
  return {
    ...v1Fields,
    ...previousMultiselectQuestion,
    ...baseFields,
  };
};

const multiselectOptionFactory = (
  numberToMake: number,
): Prisma.InputJsonValue => {
  if (!numberToMake) return [];
  return [...new Array(numberToMake)].map((_, index) => ({
    text: randomNoun(),
    ordinal: index,
    collectAddress: index % 2 === 0,
  }));
};

const multiselectOptionFactoryV2 = (numberToMake: number) => {
  if (!numberToMake) return [];
  return [...new Array(numberToMake)].map((_, index) => ({
    name: randomNoun(),
    ordinal: index,
    shouldCollectAddress: index % 2 === 0,
  }));
};
