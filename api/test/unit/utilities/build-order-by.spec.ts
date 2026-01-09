import { ListingOrderByKeys } from '../../../src/enums/listings/order-by-enum';
import { MultiselectQuestionOrderByKeys } from '../../../src/enums/multiselect-questions/order-by-enum';
import { OrderByEnum } from '../../../src/enums/shared/order-by-enum';
import {
  buildOrderBy,
  buildOrderByForListings,
  buildOrderByForMultiselectQuestions,
} from '../../../src/utilities/build-order-by';

describe('Testing buildOrderBy', () => {
  it('should return correctly mapped array when both arrays have the same length', () => {
    expect(
      buildOrderBy(['order1', 'order2'], [OrderByEnum.ASC, OrderByEnum.DESC]),
    ).toEqual([{ order1: 'asc' }, { order2: 'desc' }]);
  });

  it('should return empty array when both arrays are empty', () => {
    expect(buildOrderBy([], [])).toEqual(undefined);
  });

  describe('Testing buildOrderByForListings', () => {
    it('should return applicationDueDate in array when orderBy contains applicationDueDate', () => {
      expect(
        buildOrderByForListings(
          [ListingOrderByKeys.applicationDates],
          [OrderByEnum.ASC],
        ),
      ).toEqual([{ applicationDueDate: 'asc' }, { name: 'asc' }]);
    });

    it('should return marketingType in array when orderBy contains marketingType', () => {
      expect(
        buildOrderByForListings(
          [ListingOrderByKeys.marketingType],
          [OrderByEnum.ASC],
        ),
      ).toEqual([{ marketingType: 'asc' }, { name: 'asc' }]);
    });

    it('should return closedAt in array when orderBy contains mostRecentlyClosed', () => {
      expect(
        buildOrderByForListings(
          [ListingOrderByKeys.mostRecentlyClosed],
          [OrderByEnum.ASC],
        ),
      ).toEqual([{ closedAt: 'asc' }, { name: 'asc' }]);
    });

    it('should return publishedAt in array when orderBy contains mostRecentlyPublished', () => {
      expect(
        buildOrderByForListings(
          [ListingOrderByKeys.mostRecentlyPublished],
          [OrderByEnum.ASC],
        ),
      ).toEqual([{ publishedAt: 'asc' }, { name: 'asc' }]);
    });

    it('should return updatedAt in array when orderBy contains mostRecentlyUpdated', () => {
      expect(
        buildOrderByForListings(
          [ListingOrderByKeys.mostRecentlyUpdated],
          [OrderByEnum.ASC],
        ),
      ).toEqual([{ updatedAt: 'asc' }, { name: 'asc' }]);
    });

    it('should return name in array when orderBy contains name', () => {
      expect(
        buildOrderByForListings([ListingOrderByKeys.name], [OrderByEnum.ASC]),
      ).toEqual([{ name: 'asc' }, { name: 'asc' }]);
    });

    it('should return marketingType in array when orderBy contains status', () => {
      expect(
        buildOrderByForListings([ListingOrderByKeys.status], [OrderByEnum.ASC]),
      ).toEqual([{ status: 'asc' }, { name: 'asc' }]);
    });

    it('should return unitsAvailable in array when orderBy contains unitsAvailable', () => {
      expect(
        buildOrderByForListings(
          [ListingOrderByKeys.unitsAvailable],
          [OrderByEnum.ASC],
        ),
      ).toEqual([{ unitsAvailable: 'asc' }, { name: 'asc' }]);
    });

    it('should return isWaitlistOpen in array when orderBy contains waitlistOpen', () => {
      expect(
        buildOrderByForListings(
          [ListingOrderByKeys.waitlistOpen],
          [OrderByEnum.ASC],
        ),
      ).toEqual([{ isWaitlistOpen: 'asc' }, { name: 'asc' }]);
    });

    it('should return undefined when orderBy contains a value that is not an enum', () => {
      expect(buildOrderByForListings(['order1'], [OrderByEnum.ASC])).toEqual([
        undefined,
        { name: 'asc' },
      ]);
    });

    it('should return undefined when arrays are of unequal length', () => {
      expect(
        buildOrderByForListings(
          [ListingOrderByKeys.name],
          [OrderByEnum.ASC, OrderByEnum.ASC],
        ),
      ).toEqual(undefined);
    });

    it('should return undefined when both arrays are empty', () => {
      expect(buildOrderByForListings([], [])).toEqual(undefined);
    });
  });

  describe('Testing buildOrderByForMultiselectQuestions', () => {
    it('should return name in array when orderBy contains name', () => {
      expect(
        buildOrderByForMultiselectQuestions(
          [MultiselectQuestionOrderByKeys.name],
          [OrderByEnum.ASC],
        ),
      ).toEqual([{ name: 'asc' }, { name: 'asc' }]);
    });

    it('should return status in array when orderBy contains status', () => {
      expect(
        buildOrderByForMultiselectQuestions(
          [MultiselectQuestionOrderByKeys.status],
          [OrderByEnum.ASC],
        ),
      ).toEqual([{ status: 'asc' }, { name: 'asc' }]);
    });

    it('should return jurisdiction in array when orderBy contains jurisdiction', () => {
      expect(
        buildOrderByForMultiselectQuestions(
          [MultiselectQuestionOrderByKeys.jurisdiction],
          [OrderByEnum.ASC],
        ),
      ).toEqual([{ jurisdiction: { name: 'asc' } }, { name: 'asc' }]);
    });

    it('should return updatedAt in array when orderBy contains updatedAt', () => {
      expect(
        buildOrderByForMultiselectQuestions(
          [MultiselectQuestionOrderByKeys.updatedAt],
          [OrderByEnum.ASC],
        ),
      ).toEqual([{ updatedAt: 'asc' }, { name: 'asc' }]);
    });

    it('should return undefined when orderBy contains a value that is not an enum', () => {
      expect(
        buildOrderByForMultiselectQuestions(['order1'], [OrderByEnum.ASC]),
      ).toEqual([undefined, { name: 'asc' }]);
    });

    it('should return undefined when arrays are of unequal length', () => {
      expect(
        buildOrderByForMultiselectQuestions(
          [ListingOrderByKeys.name],
          [OrderByEnum.ASC, OrderByEnum.ASC],
        ),
      ).toEqual(undefined);
    });

    it('should return undefined when both arrays are empty', () => {
      expect(buildOrderByForMultiselectQuestions([], [])).toEqual(undefined);
    });
  });
});
