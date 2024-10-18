import { ListingEventsTypeEnum, ReviewOrderTypeEnum } from '@prisma/client';
import { LotteryDateParamValidator } from '../../../src/utilities/lottery-date-validator';

describe('Testing OrderQueryParamValidator', () => {
  it('should return true if reviewOrderType is not lottery and lotteryOptIn is null', () => {
    const lotteryDateParamValidator = new LotteryDateParamValidator();
    expect(
      lotteryDateParamValidator.validate([], {
        property: 'listingEvents',
        object: {
          reviewOrderType: ReviewOrderTypeEnum.firstComeFirstServe,
          lotteryOptIn: null,
        },
        value: undefined,
        constraints: [],
        targetName: '',
      }),
    ).toBeTruthy();
  });

  it('should return true if reviewOrderType is lottery and lotteryOptIn is no', () => {
    const lotteryDateParamValidator = new LotteryDateParamValidator();
    expect(
      lotteryDateParamValidator.validate([], {
        property: 'listingEvents',
        object: {
          reviewOrderType: ReviewOrderTypeEnum.lottery,
          lotteryOptIn: false,
        },
        value: undefined,
        constraints: [],
        targetName: '',
      }),
    ).toBeTruthy();
  });

  it('should return false if reviewOrderType is lottery and lotteryOptIn is yes and listingEvents is empty', () => {
    const lotteryDateParamValidator = new LotteryDateParamValidator();
    expect(
      lotteryDateParamValidator.validate([], {
        property: 'listingEvents',
        object: {
          reviewOrderType: ReviewOrderTypeEnum.lottery,
          lotteryOptIn: true,
        },
        value: undefined,
        constraints: [],
        targetName: '',
      }),
    ).toBeFalsy();
  });

  it('should return false if reviewOrderType is lottery and lotteryOptIn is yes and listingEvents has publicLottery without startDate', () => {
    const lotteryDateParamValidator = new LotteryDateParamValidator();
    expect(
      lotteryDateParamValidator.validate(
        [
          {
            type: ListingEventsTypeEnum.publicLottery,
            startDate: null,
            startTime: new Date(),
            endTime: new Date(),
            id: null,
            createdAt: null,
            updatedAt: null,
          },
        ],
        {
          property: 'listingEvents',
          object: {
            reviewOrderType: ReviewOrderTypeEnum.lottery,
            lotteryOptIn: true,
          },
          value: undefined,
          constraints: [],
          targetName: '',
        },
      ),
    ).toBeFalsy();
  });

  it('should return false if reviewOrderType is lottery and lotteryOptIn is yes and listingEvents has publicLottery without startTime', () => {
    const lotteryDateParamValidator = new LotteryDateParamValidator();
    expect(
      lotteryDateParamValidator.validate(
        [
          {
            type: ListingEventsTypeEnum.publicLottery,
            startDate: new Date(),
            startTime: null,
            endTime: new Date(),
            id: null,
            createdAt: null,
            updatedAt: null,
          },
        ],
        {
          property: 'listingEvents',
          object: {
            reviewOrderType: ReviewOrderTypeEnum.lottery,
            lotteryOptIn: true,
          },
          value: undefined,
          constraints: [],
          targetName: '',
        },
      ),
    ).toBeFalsy();
  });

  it('should return false if reviewOrderType is lottery and lotteryOptIn is yes and listingEvents has publicLottery without endTime', () => {
    const lotteryDateParamValidator = new LotteryDateParamValidator();
    expect(
      lotteryDateParamValidator.validate(
        [
          {
            type: ListingEventsTypeEnum.publicLottery,
            startDate: new Date(),
            startTime: new Date(),
            endTime: null,
            id: null,
            createdAt: null,
            updatedAt: null,
          },
        ],
        {
          property: 'listingEvents',
          object: {
            reviewOrderType: ReviewOrderTypeEnum.lottery,
            lotteryOptIn: true,
          },
          value: undefined,
          constraints: [],
          targetName: '',
        },
      ),
    ).toBeFalsy();
  });

  it('should return true if reviewOrderType is lottery and lotteryOptIn is yes and listingEvents has full publicLottery event', () => {
    const lotteryDateParamValidator = new LotteryDateParamValidator();
    expect(
      lotteryDateParamValidator.validate(
        [
          {
            type: ListingEventsTypeEnum.publicLottery,
            startDate: new Date(),
            startTime: new Date(),
            endTime: new Date(),
            id: null,
            createdAt: null,
            updatedAt: null,
          },
        ],
        {
          property: 'listingEvents',
          object: {
            reviewOrderType: ReviewOrderTypeEnum.lottery,
            lotteryOptIn: true,
          },
          value: undefined,
          constraints: [],
          targetName: '',
        },
      ),
    ).toBeTruthy();
  });

  it('should return true if reviewOrderType is lottery and lotteryOptIn is yes and listingEvents has full publicLottery event and other events', () => {
    const lotteryDateParamValidator = new LotteryDateParamValidator();
    expect(
      lotteryDateParamValidator.validate(
        [
          {
            type: ListingEventsTypeEnum.publicLottery,
            startDate: new Date(),
            startTime: new Date(),
            endTime: new Date(),
            id: null,
            createdAt: null,
            updatedAt: null,
          },
          {
            type: ListingEventsTypeEnum.openHouse,
            startDate: new Date(),
            startTime: new Date(),
            endTime: new Date(),
            id: null,
            createdAt: null,
            updatedAt: null,
          },
        ],
        {
          property: 'listingEvents',
          object: {
            reviewOrderType: ReviewOrderTypeEnum.lottery,
            lotteryOptIn: true,
          },
          value: undefined,
          constraints: [],
          targetName: '',
        },
      ),
    ).toBeTruthy();
  });
});
