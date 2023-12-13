import { MultiselectQuestions, Prisma } from '@prisma/client';
import { randomNoun } from './word-generator';
import { randomBoolean } from './boolean-generator';
import { InputType } from '../../src/enums/shared/input-type-enum';

// TODO map to actual multiselect questions
/* const optionFactory = (
  numOptions = 1,
): ApplicationMultiselectQuestionOption[] => {
  const options: ApplicationMultiselectQuestionOption[] = [];
  for (let i = 0; i < numOptions; i++) {
    options.push({
      key: randomName(),
      checked: randomBoolean(),
      extraData:
        i % 2 === 0
          ? [
              {
                key: `Address Input ${i}`,
                type: InputType.address,
                value: {
                  city: randomNoun(),
                  state: randomNoun(),
                  street: '123 4th St',
                  street2: 'Apt 5',
                  zipCode: '67890',
                },
              } as AddressInput,
              {
                key: `Boolean Input ${i}`,
                type: InputType.boolean,
                value: true,
              } as BooleanInput,
              {
                key: `Text Input ${i}`,
                type: InputType.text,
                value: randomName(),
              } as TextInput,
            ]
          : [],
    });
  }

  return options;
}; */

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
