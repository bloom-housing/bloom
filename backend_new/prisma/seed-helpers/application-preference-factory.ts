import { randomInt } from 'crypto';
import { Prisma } from '@prisma/client';
import { ApplicationMultiselectQuestion } from '../../src/dtos/applications/application-multiselect-question.dto';
import { randomName, randomNoun } from './word-generator';
import { randomBoolean } from './boolean-generator';
import {
  AddressInput,
  ApplicationMultiselectQuestionOption,
  BooleanInput,
  TextInput,
} from '../../src/dtos/applications/application-multiselect-question-option.dto';
import { InputType } from '../../src/enums/shared/input-type-enum';

const optionFactory = (
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
};

export const preferenceFactorySingle = (
  numOptions = 1,
): ApplicationMultiselectQuestion => ({
  key: randomName(),
  claimed: randomBoolean(),
  options: optionFactory(numOptions),
});

export const preferenceFactoryMany = (
  numberToMake: number,
): Prisma.InputJsonValue => {
  const createJson: Prisma.InputJsonValue = [...new Array(numberToMake)].map(
    () => {
      return JSON.stringify(preferenceFactorySingle(randomInt(1, 3)));
    },
  );

  return createJson;
};
