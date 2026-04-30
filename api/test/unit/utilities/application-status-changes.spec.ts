import {
  buildApplicationStatusChanges,
  isApplicationWaitlistStatus,
} from '../../../src/utilities/applicationStatusChanges';

describe('isApplicationWaitlistStatus', () => {
  it('returns true for waitlist', () => {
    expect(isApplicationWaitlistStatus('waitlist')).toBe(true);
  });

  it('returns true for waitlistDeclined', () => {
    expect(isApplicationWaitlistStatus('waitlistDeclined')).toBe(true);
  });

  it('returns false for declined', () => {
    expect(isApplicationWaitlistStatus('declined')).toBe(false);
  });

  it('returns false for submitted', () => {
    expect(isApplicationWaitlistStatus('submitted')).toBe(false);
  });

  it('returns false for null', () => {
    expect(isApplicationWaitlistStatus(null)).toBe(false);
  });

  it('returns false for undefined', () => {
    expect(isApplicationWaitlistStatus(undefined)).toBe(false);
  });
});

describe('buildApplicationStatusChanges', () => {
  describe('status changes', () => {
    it('emits a status change when status differs', () => {
      const changes = buildApplicationStatusChanges({
        initialStatus: 'submitted',
        nextStatus: 'declined',
      });
      expect(changes).toEqual([
        { type: 'status', from: 'submitted', to: 'declined' },
      ]);
    });

    it('does not emit a status change when status is the same', () => {
      const changes = buildApplicationStatusChanges({
        initialStatus: 'submitted',
        nextStatus: 'submitted',
      });
      expect(changes).toHaveLength(0);
    });

    it('does not emit a status change when nextStatus is absent', () => {
      const changes = buildApplicationStatusChanges({
        initialStatus: 'submitted',
      });
      expect(changes).toHaveLength(0);
    });

    it('uses empty string for from when initialStatus is null', () => {
      const changes = buildApplicationStatusChanges({
        initialStatus: null,
        nextStatus: 'declined',
      });
      expect(changes).toEqual([{ type: 'status', from: '', to: 'declined' }]);
    });
  });

  describe('decline reason changes', () => {
    it('emits a declineReason change when status is declined and reason is new', () => {
      const changes = buildApplicationStatusChanges({
        initialStatus: 'submitted',
        nextStatus: 'declined',
        initialApplicationDeclineReason: null,
        nextApplicationDeclineReason: 'doesNotQualify',
      });
      expect(changes).toContainEqual({
        type: 'declineReason',
        value: 'doesNotQualify',
      });
    });

    it('emits a declineReason change when status is declined and reason changed', () => {
      const changes = buildApplicationStatusChanges({
        initialStatus: 'declined',
        nextStatus: 'declined',
        initialApplicationDeclineReason: 'other',
        nextApplicationDeclineReason: 'incomeDoesNotQualify',
      });
      expect(changes).toContainEqual({
        type: 'declineReason',
        value: 'incomeDoesNotQualify',
      });
    });

    it('does not emit a declineReason change when status is not declined', () => {
      const changes = buildApplicationStatusChanges({
        initialStatus: 'submitted',
        nextStatus: 'waitlist',
        initialApplicationDeclineReason: null,
        nextApplicationDeclineReason: 'doesNotQualify',
      });
      expect(changes.find((c) => c.type === 'declineReason')).toBeUndefined();
    });

    it('does not emit a declineReason change when reason is unchanged', () => {
      const changes = buildApplicationStatusChanges({
        initialStatus: 'declined',
        nextStatus: 'declined',
        initialApplicationDeclineReason: 'other',
        nextApplicationDeclineReason: 'other',
      });
      expect(changes.find((c) => c.type === 'declineReason')).toBeUndefined();
    });

    it('does not emit a declineReason change when next reason is empty', () => {
      const changes = buildApplicationStatusChanges({
        initialStatus: 'submitted',
        nextStatus: 'declined',
        initialApplicationDeclineReason: null,
        nextApplicationDeclineReason: null,
      });
      expect(changes.find((c) => c.type === 'declineReason')).toBeUndefined();
    });
  });

  describe('waitlist number changes', () => {
    it('emits accessibleWaitlist when status is waitlist and number is new', () => {
      const changes = buildApplicationStatusChanges({
        initialStatus: 'submitted',
        nextStatus: 'waitlist',
        nextAccessibleUnitWaitlistNumber: 3,
      });
      expect(changes).toContainEqual({
        type: 'accessibleWaitlist',
        value: '3',
      });
    });

    it('emits conventionalWaitlist when status is waitlist and number is new', () => {
      const changes = buildApplicationStatusChanges({
        initialStatus: 'submitted',
        nextStatus: 'waitlist',
        nextConventionalUnitWaitlistNumber: 7,
      });
      expect(changes).toContainEqual({
        type: 'conventionalWaitlist',
        value: '7',
      });
    });

    it('does not emit waitlist numbers when status is not waitlist', () => {
      const changes = buildApplicationStatusChanges({
        initialStatus: 'submitted',
        nextStatus: 'declined',
        nextAccessibleUnitWaitlistNumber: 3,
        nextConventionalUnitWaitlistNumber: 7,
      });
      expect(
        changes.find((c) => c.type === 'accessibleWaitlist'),
      ).toBeUndefined();
      expect(
        changes.find((c) => c.type === 'conventionalWaitlist'),
      ).toBeUndefined();
    });

    it('does not emit waitlist numbers when they are unchanged', () => {
      const changes = buildApplicationStatusChanges({
        initialStatus: 'waitlist',
        nextStatus: 'waitlist',
        initialAccessibleUnitWaitlistNumber: 3,
        nextAccessibleUnitWaitlistNumber: 3,
      });
      expect(
        changes.find((c) => c.type === 'accessibleWaitlist'),
      ).toBeUndefined();
    });
  });

  describe('combined changes', () => {
    it('emits status and declineReason together', () => {
      const changes = buildApplicationStatusChanges({
        initialStatus: 'submitted',
        nextStatus: 'declined',
        nextApplicationDeclineReason: 'incomeDoesNotQualify',
      });
      expect(changes).toHaveLength(2);
      expect(changes[0]).toEqual({
        type: 'status',
        from: 'submitted',
        to: 'declined',
      });
      expect(changes[1]).toEqual({
        type: 'declineReason',
        value: 'incomeDoesNotQualify',
      });
    });

    it('emits status, accessibleWaitlist, and conventionalWaitlist together', () => {
      const changes = buildApplicationStatusChanges({
        initialStatus: 'submitted',
        nextStatus: 'waitlist',
        nextAccessibleUnitWaitlistNumber: 2,
        nextConventionalUnitWaitlistNumber: 5,
      });
      expect(changes).toHaveLength(3);
    });
  });
});
