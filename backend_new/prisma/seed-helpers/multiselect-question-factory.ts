import {
  MultiselectQuestionsApplicationSectionEnum,
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
    numberOfOptions?: number;
    multiselectQuestion?: Partial<Prisma.MultiselectQuestionsCreateInput>;
  },
): Prisma.MultiselectQuestionsCreateInput => {
  const previousMultiselectQuestion = optionalParams?.multiselectQuestion || {};
  const text = optionalParams?.multiselectQuestion?.text || randomName();
  return {
    text: text,
    subText: `sub text for ${text}`,
    description: `description of ${text}`,
    links: [],
    options: multiselectOptionFactory(randomInt(1, 3)),
    optOutText: optionalParams?.optOut ? "I don't want this preference" : null,
    hideFromListing: false,
    applicationSection:
      optionalParams?.multiselectQuestion?.applicationSection ||
      multiselectAppSectionAsArray[
        randomInt(multiselectAppSectionAsArray.length)
      ],
    ...previousMultiselectQuestion,
    jurisdictions: {
      connect: {
        id: jurisdictionId,
      },
    },
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
