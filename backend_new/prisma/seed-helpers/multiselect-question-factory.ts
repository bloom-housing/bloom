import {
  MultiselectQuestionsApplicationSectionEnum,
  Prisma,
} from '@prisma/client';

export const multiselectQuestionFactory = (
  i: number,
  jurisdictionId: string,
): Prisma.MultiselectQuestionsCreateInput => ({
  text: `text ${i}`,
  subText: `subText ${i}`,
  description: `description ${i}`,
  links: {},
  options: {},
  optOutText: `optOutText ${i}`,
  hideFromListing: false,
  applicationSection: MultiselectQuestionsApplicationSectionEnum.programs,
  jurisdictions: {
    connect: {
      id: jurisdictionId,
    },
  },
});
