import { Prisma } from '@prisma/client';

export const getModelFields = (modelName) => {
  return Prisma.dmmf.datamodel.models.filter(
    (model) => model.name === modelName,
  )[0].fields;
};

export const fillModelStringFields = (modelName, dto) => {
  const result = {};
  getModelFields(modelName)
    .filter((field) => field.isId === false && field.type === 'String')
    .map((field) => field.name)
    .forEach((key) => {
      result[key] = dto[key] || null;
    });
  return result;
};
