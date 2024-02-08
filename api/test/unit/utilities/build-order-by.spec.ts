import { OrderByEnum } from '../../../src/enums/shared/order-by-enum';
import { buildOrderBy } from '../../../src/utilities/build-order-by';
describe('Testing buildOrderBy', () => {
  it('should return correctly mapped array when both arrays have length', () => {
    expect(
      buildOrderBy(['order1', 'order2'], [OrderByEnum.ASC, OrderByEnum.DESC]),
    ).toEqual([{ order1: 'asc' }, { order2: 'desc' }]);
  });
  it('should return empty array when both arrays are empty', () => {
    expect(buildOrderBy([], [])).toEqual(undefined);
  });
});
