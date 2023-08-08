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
    it('should return 1 page of 10 items for 10 items present', () => {
      expect(buildPaginationMetaInfo({ limit: 10, page: 1 }, 10, 10)).toEqual({
        currentPage: 1,
        itemCount: 10,
        itemsPerPage: 10,
        totalItems: 10,
        totalPages: 1,
      });
    });
    it('should return 2 pages of 10 items for 20 items present', () => {
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
    it('should return 1 page of 5 items for 5 items present when "pagesize" is 10', () => {
      expect(buildPaginationMetaInfo({ limit: 10, page: 1 }, 5, 5)).toEqual({
        currentPage: 1,
        itemCount: 5,
        itemsPerPage: 10,
        totalItems: 5,
        totalPages: 1,
      });
    });
    it('should return 1 page of 0 items for 0 items present when "pagesize" is 20', () => {
      expect(buildPaginationMetaInfo({ limit: 10, page: 1 }, 0, 0)).toEqual({
        currentPage: 1,
        itemCount: 0,
        itemsPerPage: 10,
        totalItems: 0,
        totalPages: 0,
      });
    });
    it('should return 1 page of 100 items for 100 items present when "pagesize" is 100', () => {
      expect(
        buildPaginationMetaInfo({ limit: 100, page: 1 }, 100, 100),
      ).toEqual({
        currentPage: 1,
        itemCount: 100,
        itemsPerPage: 100,
        totalItems: 100,
        totalPages: 1,
      });
    });
    it('should return page 10 of 200 items present when "pagesize" is 20', () => {
      expect(buildPaginationMetaInfo({ limit: 20, page: 10 }, 200, 20)).toEqual(
        {
          currentPage: 10,
          itemCount: 20,
          itemsPerPage: 20,
          totalItems: 200,
          totalPages: 10,
        },
      );
    });
  });
});
