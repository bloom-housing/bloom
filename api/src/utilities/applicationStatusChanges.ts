type ApplicationStatusChangeInput = {
  initialStatus?: string | null;
  nextStatus?: string | null;
  initialApplicationDeclineReason?: string | null;
  nextApplicationDeclineReason?: string | null;
  initialApplicationDeclineReasonAdditionalDetails?: string | null;
  nextApplicationDeclineReasonAdditionalDetails?: string | null;
  initialAccessibleUnitWaitlistNumber?: string | number | null;
  nextAccessibleUnitWaitlistNumber?: string | number | null;
  initialConventionalUnitWaitlistNumber?: string | number | null;
  nextConventionalUnitWaitlistNumber?: string | number | null;
  initialManualLotteryPositionNumber?: string | number | null;
  nextManualLotteryPositionNumber?: string | number | null;
};

export type ApplicationStatusChangeItem =
  | {
      type: 'status';
      from: string;
      to: string;
    }
  | {
      type: 'declineReason';
      value: string;
    }
  | {
      type: 'declineReasonDetails';
      value: string;
    }
  | {
      type: 'accessibleWaitlist';
      value: string;
    }
  | {
      type: 'conventionalWaitlist';
      value: string;
    }
  | {
      type: 'lotteryPosition';
      value: string;
    };

const normalizeValue = (value?: string | number | null) => {
  if (value === null || value === undefined) return '';
  return value.toString();
};

const hasValue = (value: string) => value !== '';

export const isApplicationWaitlistStatus = (status?: string | null) => {
  return status === 'waitlist' || status === 'waitlistDeclined';
};

export const buildApplicationStatusChanges = (
  input: ApplicationStatusChangeInput,
): ApplicationStatusChangeItem[] => {
  const initialStatus = input.initialStatus ?? undefined;
  const nextStatus = input.nextStatus ?? undefined;

  const initialDeclineReason = normalizeValue(
    input.initialApplicationDeclineReason,
  );
  const nextDeclineReason = normalizeValue(input.nextApplicationDeclineReason);

  const initialDeclineReasonDetails = normalizeValue(
    input.initialApplicationDeclineReasonAdditionalDetails,
  );
  const nextDeclineReasonDetails = normalizeValue(
    input.nextApplicationDeclineReasonAdditionalDetails,
  );

  const initialAccessible = normalizeValue(
    input.initialAccessibleUnitWaitlistNumber,
  );
  const nextAccessible = normalizeValue(input.nextAccessibleUnitWaitlistNumber);

  const initialConventional = normalizeValue(
    input.initialConventionalUnitWaitlistNumber,
  );
  const nextConventional = normalizeValue(
    input.nextConventionalUnitWaitlistNumber,
  );

  const initialLottery = normalizeValue(
    input.initialManualLotteryPositionNumber,
  );
  const nextLottery = normalizeValue(input.nextManualLotteryPositionNumber);

  const statusChanged = !!nextStatus && nextStatus !== initialStatus;
  const nextIsDeclined = nextStatus === 'declined';
  const nextIsWaitlist = isApplicationWaitlistStatus(nextStatus);

  const changes: ApplicationStatusChangeItem[] = [];

  if (statusChanged) {
    changes.push({
      type: 'status',
      from: initialStatus ?? '',
      to: nextStatus,
    });
  }

  if (
    nextIsDeclined &&
    nextDeclineReason !== initialDeclineReason &&
    hasValue(nextDeclineReason)
  ) {
    changes.push({
      type: 'declineReason',
      value: nextDeclineReason,
    });
  }

  if (
    nextDeclineReasonDetails &&
    nextDeclineReasonDetails !== initialDeclineReasonDetails &&
    hasValue(nextDeclineReasonDetails)
  ) {
    changes.push({
      type: 'declineReasonDetails',
      value: nextDeclineReasonDetails,
    });
  }

  if (nextIsWaitlist) {
    if (nextAccessible !== initialAccessible && hasValue(nextAccessible)) {
      changes.push({
        type: 'accessibleWaitlist',
        value: nextAccessible,
      });
    }
    if (
      nextConventional !== initialConventional &&
      hasValue(nextConventional)
    ) {
      changes.push({
        type: 'conventionalWaitlist',
        value: nextConventional,
      });
    }
  }

  if (nextLottery !== initialLottery && hasValue(nextLottery)) {
    changes.push({
      type: 'lotteryPosition',
      value: nextLottery,
    });
  }

  return changes;
};
