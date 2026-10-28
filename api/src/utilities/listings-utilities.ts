import { Logger } from '@nestjs/common';
import { ListingEventsTypeEnum } from '@prisma/client';
import { ListingUpdate } from '../dtos/listings/listing-update.dto';
import { ListingEvent } from '../dtos/listings/listing-event.dto';

export const checkIfDatesOrReviewOrderChanged = (
  dto: ListingUpdate,
  logger: Logger,
  storedApplicationDueDate: string,
  storedLotteryEvent: ListingEvent,
  storedReviewOrderType: string,
) => {
  if (dto.applicationDueDate?.toISOString() !== storedApplicationDueDate) {
    logger.warn('User attempted to change application due date after close');
    return true;
  }

  if (storedReviewOrderType !== dto?.reviewOrderType) {
    logger.warn('User attempted to change review order type after close');
    return true;
  }
  const lotteryEvent = dto.listingEvents?.find(
    (event) => event?.type === ListingEventsTypeEnum.publicLottery,
  );

  if (lotteryEvent && storedLotteryEvent) {
    const isSameStartDate =
      lotteryEvent?.startDate?.toISOString() ===
      storedLotteryEvent?.startDate?.toISOString();
    const isSameStartTime =
      lotteryEvent?.startTime?.toISOString() ===
      storedLotteryEvent?.startTime?.toISOString();
    const isSameEndTime =
      lotteryEvent?.endTime?.toISOString() ===
      storedLotteryEvent?.endTime?.toISOString();

    if (!(isSameStartDate && isSameStartTime && isSameEndTime)) {
      logger.warn('User attempted to change lottery run dates after close');
      return true;
    }
  }

  return false;
};
