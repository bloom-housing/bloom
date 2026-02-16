type ApplicationStatusChangeInput = {
  initialStatus?: string | null;
  nextStatus?: string | null;
  initialAccessibleUnitWaitlistNumber?: string | number | null;
  nextAccessibleUnitWaitlistNumber?: string | number | null;
  initialConventionalUnitWaitlistNumber?: string | number | null;
  nextConventionalUnitWaitlistNumber?: string | number | null;
};

export type ApplicationStatusChangeItem =
  | {
      type: 'status';
      from: string;
      to: string;
    }
  | {
      type: 'accessibleWaitlist';
      value: string;
    }
  | {
      type: 'conventionalWaitlist';
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

  const statusChanged = !!nextStatus && nextStatus !== initialStatus;
  const nextIsWaitlist = isApplicationWaitlistStatus(nextStatus);

  const changes: ApplicationStatusChangeItem[] = [];

  if (statusChanged) {
    changes.push({
      type: 'status',
      from: initialStatus ?? '',
      to: nextStatus,
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

  return changes;
};
