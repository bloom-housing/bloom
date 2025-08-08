import { randomUUID } from 'node:crypto';
import {
  fillModelStringFields,
  getModelFields,
} from '../../../src/utilities/model-fields';
describe('Testing access to model fields', () => {
  describe('Testing getModelFields', () => {
    it('should return schema information on model fields', () => {
      const ListingNeighborhoodAmenities = getModelFields(
        'ListingNeighborhoodAmenities',
      );
      // ID field
      expect(ListingNeighborhoodAmenities[0]).toMatchObject({
        kind: 'scalar',
        name: 'id',
        type: 'String',
        hasDefaultValue: true,
        isGenerated: false,
        isId: true,
        isList: false,
        isReadOnly: false,
        isRequired: true,
        isUnique: false,
        isUpdatedAt: false,
      });
      // Non-ID field
      expect(ListingNeighborhoodAmenities[1]).toMatchObject({
        kind: 'scalar',
        name: 'createdAt',
        type: 'DateTime',
        hasDefaultValue: true,
        isGenerated: false,
        isId: false,
        isList: false,
        isReadOnly: false,
        isRequired: true,
        isUnique: false,
        isUpdatedAt: false,
      });
      expect(ListingNeighborhoodAmenities[3]).toMatchObject({
        kind: 'scalar',
        name: 'groceryStores',
        type: 'String',
        hasDefaultValue: false,
        isGenerated: false,
        isId: false,
        isList: false,
        isReadOnly: false,
        isRequired: false,
        isUnique: false,
        isUpdatedAt: false,
      });

      expect(getModelFields('Units')).toHaveLength(30);
    });
  });
  describe('Testing fillModelStringFields', () => {
    it("should fill all the fields which weren't filled out with null", () => {
      expect(
        fillModelStringFields('ListingNeighborhoodAmenities', {
          id: randomUUID(), // id should be filtered out
          schools: 'Schools',
          pharmacies: 'Pharmacies',
        }),
      ).toEqual({
        schools: 'Schools',
        healthCareResources: null,
        groceryStores: null,
        parksAndCommunityCenters: null,
        pharmacies: 'Pharmacies',
        publicTransportation: null,
      });
    });
  });
});
