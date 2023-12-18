import { MultiselectQuestions, Prisma } from '@prisma/client';
import { randomNoun } from './word-generator';
import { randomBoolean } from './boolean-generator';
import { InputType } from '../../src/enums/shared/input-type-enum';

export const preferenceFactory = (
  multiselectQuestions: Partial<MultiselectQuestions>[],
): Prisma.InputJsonValue => {
  return JSON.stringify(
    multiselectQuestions.map((question) => ({
      multiselectQuestionId: question.id,
      key: question.text,
      claimed: randomBoolean(),
      options: JSON.parse(JSON.stringify(question.options)).map((option) => {
        return {
          key: option.key,
          checked: randomBoolean(),
          extraData: option.collectAddress
            ? [
                {
                  key: 'Address',
                  type: InputType.address,
                  value: {
                    city: randomNoun(),
                    state: randomNoun(),
                    street: '123 4th St',
                    street2: 'Apt 5',
                    zipCode: '67890',
                  },
                },
              ]
            : [],
        };
      }),
    })),
  );
};
