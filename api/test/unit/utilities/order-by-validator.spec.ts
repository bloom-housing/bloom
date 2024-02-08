import { OrderQueryParamValidator } from '../../../src/utilities/order-by-validator';
describe('Testing OrderQueryParamValidator', () => {
  it('should return true if order array and orderDir array are the same length', () => {
    const orderQueryParamValidator = new OrderQueryParamValidator();
    expect(
      orderQueryParamValidator.validate(['order'], {
        property: 'orderDir',
        object: {
          orderBy: ['asc'],
        },
        value: undefined,
        constraints: [],
        targetName: '',
      }),
    ).toBeTruthy();
  });
  it('should return true if order array and orderBy array are the same length', () => {
    const orderQueryParamValidator = new OrderQueryParamValidator();
    expect(
      orderQueryParamValidator.validate(['order'], {
        property: 'orderBy',
        object: {
          orderDir: ['asc'],
        },
        value: undefined,
        constraints: [],
        targetName: '',
      }),
    ).toBeTruthy();
  });
  it('should return false if order array length > orderDir array length', () => {
    const orderQueryParamValidator = new OrderQueryParamValidator();
    expect(
      orderQueryParamValidator.validate(['order', 'order2'], {
        property: 'orderDir',
        object: {
          orderBy: ['asc'],
        },
        value: undefined,
        constraints: [],
        targetName: '',
      }),
    ).toBeFalsy();
  });
  it('should return false if order array length < orderDir array length', () => {
    const orderQueryParamValidator = new OrderQueryParamValidator();
    expect(
      orderQueryParamValidator.validate(['order'], {
        property: 'orderDir',
        object: {
          orderBy: ['asc', 'asc'],
        },
        value: undefined,
        constraints: [],
        targetName: '',
      }),
    ).toBeFalsy();
  });
  it('should return false if order array length > orderBy array length', () => {
    const orderQueryParamValidator = new OrderQueryParamValidator();
    expect(
      orderQueryParamValidator.validate(['order', 'order2'], {
        property: 'orderBy',
        object: {
          orderDir: ['asc'],
        },
        value: undefined,
        constraints: [],
        targetName: '',
      }),
    ).toBeFalsy();
  });
  it('should return false if order array length < orderBy array length', () => {
    const orderQueryParamValidator = new OrderQueryParamValidator();
    expect(
      orderQueryParamValidator.validate(['order'], {
        property: 'orderBy',
        object: {
          orderDir: ['asc', 'asc'],
        },
        value: undefined,
        constraints: [],
        targetName: '',
      }),
    ).toBeFalsy();
  });
});
