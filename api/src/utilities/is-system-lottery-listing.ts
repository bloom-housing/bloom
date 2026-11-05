import { ReviewOrderTypeEnum } from '@prisma/client';

const LOTTERY_REVIEW_ORDER_TYPES: ReviewOrderTypeEnum[] = [
  ReviewOrderTypeEnum.lottery,
  ReviewOrderTypeEnum.waitlistLottery,
];

/**
 * A listing uses Bloom's system lottery when it is a lottery listing that explicitly opted in.
 * For these listings the manually entered lottery position number is hidden and not editable.
 */
export const isSystemLotteryListing = (
  listing?: {
    reviewOrderType?: ReviewOrderTypeEnum | null;
    lotteryOptIn?: boolean | null;
  } | null,
): boolean =>
  LOTTERY_REVIEW_ORDER_TYPES.includes(listing?.reviewOrderType) &&
  listing?.lotteryOptIn === true;
