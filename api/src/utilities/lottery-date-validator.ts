import { ListingEventsTypeEnum, ReviewOrderTypeEnum } from '@prisma/client';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { ListingEvent } from '../dtos/listings/listing-event.dto';

/*
    This is a custom validator to make sure lottery startDate is set when reviewOrder is set to lottery
  */
@ValidatorConstraint({ name: 'lotteryDate', async: false })
export class LotteryDateParamValidator implements ValidatorConstraintInterface {
  validate(
    listingEvents: ListingEvent[] | undefined,
    args: ValidationArguments,
  ) {
    const { reviewOrderType } = args.object as {
      reviewOrderType: string;
    };
    if (reviewOrderType === ReviewOrderTypeEnum.lottery) {
      return !!listingEvents.find(
        (event: ListingEvent) =>
          event.type === ListingEventsTypeEnum.publicLottery &&
          event.startDate &&
          event.startTime &&
          event.endTime,
      );
    }
    return true;
  }

  defaultMessage() {
    return 'lotteryDate run date must be set';
  }
}
