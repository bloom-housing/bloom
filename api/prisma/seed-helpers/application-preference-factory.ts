import { Prisma } from '@prisma/client';
import { randomBoolean } from './boolean-generator';
import { InputType } from '../../src/enums/shared/input-type-enum';
import { addressFactory } from './address-factory';

export const preferenceFactory = (
  multiselectQuestions: {
    id?: string;
    text?: string;
    options?: Prisma.JsonValue | null;
  }[],
  randomize = false,
): Prisma.InputJsonValue => {
  return multiselectQuestions.map((question) => ({
    multiselectQuestionId: question.id,
    key: question.text,
    claimed: randomize ? randomBoolean() : true,
    options: JSON.parse(JSON.stringify(question?.options)).map((option) => {
      return {
        key: option.text,
        checked: randomize ? randomBoolean() : true,
        extraData: option.collectAddress
          ? [
              {
                key: 'address',
                type: InputType.address,
                value: addressFactory(),
              },
            ]
          : [],
      };
    }),
  }));
};
