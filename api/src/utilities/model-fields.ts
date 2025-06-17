import { Prisma } from '@prisma/client';

/**
 * A simplified, exportable subset of Prisma's DMMF field definition.
 */
export interface ModelField {
  /** The name of the field on the model */
  name: string;
  /** Whether this field is the primary identifier */
  isId: boolean;
  /** The Prisma scalar type of the field (e.g. "String", "Int", etc.) */
  type: string;
}

/**
 * Get the DMMF field metadata for a given model, cast to our exportable interface.
 * @param modelName The name of the Prisma model (as defined in schema.prisma)
 * @returns Array of ModelField objects
 */
export function getModelFields(modelName: string): ModelField[] {
  const model = Prisma.dmmf.datamodel.models.find((m) => m.name === modelName);
  if (!model) {
    throw new Error(`Model '${modelName}' not found in Prisma DMMF.`);
  }
  // Cast the internal field definitions to our simplified, exportable shape
  return model.fields as unknown as ModelField[];
}

/**
 * Create an object with only the string-based fields (excluding IDs) for a model.
 * Useful for seeding or generating partial objects from input data.
 * @param modelName The Prisma model name
 * @param data A record of input values keyed by field name
 * @returns A record containing each non-ID string field, defaulting to null if missing
 */
export function fillModelStringFields(
  modelName: string,
  data: Record<string, string>,
): Record<string, string | null> {
  return Object.fromEntries(
    getModelFields(modelName)
      .filter((field) => !field.isId && field.type === 'String')
      .map((field) => [field.name, (data[field.name] as string) || null]),
  );
}
