import { fillModelStringFields } from '../../../src/utilities/model-fields';
describe('Testing access to model fields', () => {
  describe('Testing fillModelStringFields', () => {
    it("should fill all the fields which weren't filled out with null", () => {
      expect(
        fillModelStringFields('ListingNeighborhoodAmenities', {
          schools: 'Schools',
        }),
      ).toMatchObject({
        // there are more properties than this, we'll just test a few:
        schools: 'Schools',
        healthCareResources: null,
        groceryStores: null,
      });
    });
  });
});
