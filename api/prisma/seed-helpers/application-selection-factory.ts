import { Prisma, PrismaClient } from '@prisma/client';
import { randomBoolean } from './boolean-generator';
import { randomName } from './word-generator';
import { ApplicationSelectionOptionCreate } from '../../src/dtos/applications/application-selection-option-create.dto';

export const applicationSelectionFactory = async (
  applicationId: string,
  multiselectQuestionId: string,
  prismaClient: PrismaClient,
  optionalParams?: {
    hasOptedOut?: boolean;
    multiselectOptionId?: string;
    selections?: ApplicationSelectionOptionCreate[];
  },
): Promise<Prisma.ApplicationSelectionsCreateInput> => {
  const selectedOptions = [];

  if (optionalParams?.selections?.length > 0) {
    for (const selectionOption of optionalParams?.selections) {
      let address;
      // If an address is passed, create the address for the selection option
      if (selectionOption.addressHolderAddress) {
        address = await prismaClient.address.create({
          data: {
            ...selectionOption.addressHolderAddress,
          },
        });
      }
      // Build the create selection option body
      const selectedOptionBody = {
        addressHolderAddressId: address?.id,
        addressHolderName: selectionOption.addressHolderName,
        addressHolderRelationship: selectionOption.addressHolderRelationship,
        isGeocodingVerified: selectionOption.isGeocodingVerified,
        multiselectOptionId: selectionOption.multiselectOption.id,
      };
      // Push the selection option to a list for the createMany
      selectedOptions.push(selectedOptionBody);
    }
  } else if (optionalParams?.multiselectOptionId) {
    // Build the create selection option body
    const selectedOptionBody = {
      addressHolderName: randomName(),
      isGeocodingVerified: randomBoolean(),
      multiselectOptionId: optionalParams?.multiselectOptionId,
    };
    // Push the selection option to a list for the createMany
    selectedOptions.push(selectedOptionBody);
  }
  // Create the application selection with nested createMany applicationSelectionOptions
  return {
    application: { connect: { id: applicationId } },
    hasOptedOut: optionalParams?.hasOptedOut ?? randomBoolean(),
    multiselectQuestion: { connect: { id: multiselectQuestionId } },
    selections: {
      createMany: {
        data: selectedOptions,
      },
    },
  };
};
