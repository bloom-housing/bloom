import { randomUUID } from 'crypto';
import dayjs from 'dayjs';
import { Logger } from '@nestjs/common';
import {
  ListingEventsTypeEnum,
  ListingsStatusEnum,
  ReviewOrderTypeEnum,
} from '@prisma/client';
import { ListingUpdate } from '../../../src/dtos/listings/listing-update.dto';
import { checkIfDatesOrReviewOrderChanged } from '../../../src/utilities/listings-utilities';

const logger = new Logger();

const dueDate = dayjs(new Date()).subtract(1, 'days').toDate();
const reviewOrderType = ReviewOrderTypeEnum.lottery;

const mockListingUpdate = {
  id: randomUUID(),
  name: 'example listing name',
  jurisdictions: {
    id: randomUUID(),
  },
  status: ListingsStatusEnum.active,

  applicationDueDate: dueDate,
  listingEvents: [
    {
      type: ListingEventsTypeEnum.publicLottery,
      startDate: dueDate,
      startTime: dueDate,
      endTime: dueDate,
    },
  ],
  reviewOrderType: reviewOrderType,
} as ListingUpdate;

describe('Testing listings utility checkIfDatesOrReviewOrderChanged', () => {
  it('should return false if no changes', () => {
    expect(
      checkIfDatesOrReviewOrderChanged(
        mockListingUpdate,
        logger,
        dueDate.toISOString(),
        {
          ...mockListingUpdate.listingEvents[0],
          createdAt: undefined,
          updatedAt: undefined,
          assets: undefined,
          id: undefined,
        },
        reviewOrderType,
      ),
    ).toBeFalse();
  });

  it('should return true if applicationDueDate has changed', () => {
    expect(
      checkIfDatesOrReviewOrderChanged(
        mockListingUpdate,
        logger,
        new Date().toISOString(),
        {
          ...mockListingUpdate.listingEvents[0],
          createdAt: undefined,
          updatedAt: undefined,
          assets: undefined,
          id: undefined,
        },
        reviewOrderType,
      ),
    ).toBeTrue();
  });

  it('should return true if reviewOrderType has changed', () => {
    expect(
      checkIfDatesOrReviewOrderChanged(
        mockListingUpdate,
        logger,
        dueDate.toISOString(),
        {
          ...mockListingUpdate.listingEvents[0],
          createdAt: undefined,
          updatedAt: undefined,
          assets: undefined,
          id: undefined,
        },
        ReviewOrderTypeEnum.firstComeFirstServe,
      ),
    ).toBeTrue();
  });

  it('should return true if listingEvent startDate has changed', () => {
    expect(
      checkIfDatesOrReviewOrderChanged(
        mockListingUpdate,
        logger,
        dueDate.toISOString(),
        {
          ...mockListingUpdate.listingEvents[0],
          startDate: new Date(),
          createdAt: undefined,
          updatedAt: undefined,
          assets: undefined,
          id: undefined,
        },
        reviewOrderType,
      ),
    ).toBeTrue();
  });

  it('should return true if listingEvent startTime has changed', () => {
    expect(
      checkIfDatesOrReviewOrderChanged(
        mockListingUpdate,
        logger,
        dueDate.toISOString(),
        {
          ...mockListingUpdate.listingEvents[0],
          startTime: new Date(),
          createdAt: undefined,
          updatedAt: undefined,
          assets: undefined,
          id: undefined,
        },
        reviewOrderType,
      ),
    ).toBeTrue();
  });

  it('should return true if listingEvent endTime has changed', () => {
    expect(
      checkIfDatesOrReviewOrderChanged(
        mockListingUpdate,
        logger,
        dueDate.toISOString(),
        {
          ...mockListingUpdate.listingEvents[0],
          endTime: new Date(),
          createdAt: undefined,
          updatedAt: undefined,
          assets: undefined,
          id: undefined,
        },
        reviewOrderType,
      ),
    ).toBeTrue();
  });
});
