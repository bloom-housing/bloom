import {
  shouldPaginate,
  calculateSkip,
  calculateTake,
  buildPaginationMetaInfo,
} from '../../../src/utilities/pagination-helpers';
describe('Testing pagination helpers', () => {
  describe('Testing shouldPaginate', () => {
    it("should return false for limit of 'all'", () => {
      expect(shouldPaginate('all', 0)).toBeFalsy();
    });
    it('should return false for limit of 0', () => {
      expect(shouldPaginate(0, 1)).toBeFalsy();
    });
    it('should return false for page of 0', () => {
      expect(shouldPaginate(1, 0)).toBeFalsy();
    });
    it('should return true limit > 0, page > 0', () => {
      expect(shouldPaginate(1, 1)).toBeTruthy();
    });
  });
  describe('Testing calculateSkip', () => {
    it("should return 0 for limit of 'all'", () => {
      expect(calculateSkip('all', 0)).toBe(0);
    });
    it('should return 0 for page 1', () => {
      expect(calculateSkip(1, 1)).toBe(0);
    });
    it('should return 10 when on page 2 with limit 10', () => {
      expect(calculateSkip(10, 2)).toBe(10);
    });
  });
  describe('Testing calculateTake', () => {
    it("should return undefined for limit of 'all'", () => {
      expect(calculateTake('all')).toBe(undefined);
    });
    it('should return limit for numeric limit', () => {
      expect(calculateTake(1)).toBe(1);
    });
  });
  describe('Testing buildPaginationMetaInfo', () => {
    it('should return 1 page for 1 full page', () => {
      expect(buildPaginationMetaInfo({ limit: 10, page: 1 }, 10, 10)).toEqual({
        currentPage: 1,
        itemCount: 10,
        itemsPerPage: 10,
        totalItems: 10,
        totalPages: 1,
      });
    });
    it('should return 2 page for 1 full page', () => {
      expect(buildPaginationMetaInfo({ limit: 10, page: 1 }, 20, 10)).toEqual({
        currentPage: 1,
        itemCount: 10,
        itemsPerPage: 10,
        totalItems: 20,
        totalPages: 2,
      });
    });
    it('should return all records for unpaginated', () => {
      expect(
        buildPaginationMetaInfo({ limit: 'all', page: 1 }, 10, 10),
      ).toEqual({
        currentPage: 1,
        itemCount: 10,
        itemsPerPage: 10,
        totalItems: 10,
        totalPages: 1,
      });
    });
  });
});
