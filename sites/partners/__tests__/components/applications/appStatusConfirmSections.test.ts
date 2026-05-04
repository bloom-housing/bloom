import {
  ApplicationDeclineReasonEnum,
  ApplicationStatusEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { buildAppStatusConfirmSections } from "../../../src/components/applications/helpers"
import { FormTypes } from "../../../src/lib/applications/FormTypes"

const makeFormTypes = (
  status?: ApplicationStatusEnum,
  applicationDeclineReason?: ApplicationDeclineReasonEnum,
  accessibleUnitWaitlistNumber?: number,
  conventionalUnitWaitlistNumber?: number
): Partial<FormTypes> => ({
  application: {
    status,
    applicationDeclineReason,
    accessibleUnitWaitlistNumber,
    conventionalUnitWaitlistNumber,
    applicant: {} as never,
    applicationsMailingAddress: {} as never,
  },
})

describe("buildAppStatusConfirmSections", () => {
  describe("status changes", () => {
    it("includes status change when status differs", () => {
      const result = buildAppStatusConfirmSections(
        makeFormTypes(ApplicationStatusEnum.declined) as FormTypes,
        makeFormTypes(ApplicationStatusEnum.submitted)
      )
      expect(result.changes).toHaveLength(1)
      expect(result.changes[0].label).toMatch(/status/i)
    })

    it("produces no changes when status is unchanged and no other fields changed", () => {
      const result = buildAppStatusConfirmSections(
        makeFormTypes(ApplicationStatusEnum.submitted) as FormTypes,
        makeFormTypes(ApplicationStatusEnum.submitted)
      )
      expect(result.changes).toHaveLength(0)
      expect(result.removals).toHaveLength(0)
    })
  })

  describe("decline reason changes", () => {
    it("includes decline reason in changes when status is declined and reason is new", () => {
      const result = buildAppStatusConfirmSections(
        makeFormTypes(
          ApplicationStatusEnum.declined,
          ApplicationDeclineReasonEnum.ageRestriction
        ) as FormTypes,
        makeFormTypes(ApplicationStatusEnum.submitted)
      )
      const declineChange = result.changes.find((c) => c.label.toLowerCase().includes("decline"))
      expect(declineChange).toBeDefined()
    })

    it("includes decline reason in changes when reason changes while status stays declined", () => {
      const result = buildAppStatusConfirmSections(
        makeFormTypes(
          ApplicationStatusEnum.declined,
          ApplicationDeclineReasonEnum.incomeRestriction
        ) as FormTypes,
        makeFormTypes(ApplicationStatusEnum.declined, ApplicationDeclineReasonEnum.other)
      )
      const declineChange = result.changes.find((c) => c.label.toLowerCase().includes("decline"))
      expect(declineChange).toBeDefined()
    })

    it("does not include decline reason when reason is unchanged", () => {
      const result = buildAppStatusConfirmSections(
        makeFormTypes(
          ApplicationStatusEnum.declined,
          ApplicationDeclineReasonEnum.other
        ) as FormTypes,
        makeFormTypes(ApplicationStatusEnum.declined, ApplicationDeclineReasonEnum.other)
      )
      const declineChange = result.changes.find((c) => c.label.toLowerCase().includes("decline"))
      expect(declineChange).toBeUndefined()
    })

    it("does not include decline reason when status is not declined", () => {
      const result = buildAppStatusConfirmSections(
        makeFormTypes(
          ApplicationStatusEnum.submitted,
          ApplicationDeclineReasonEnum.ageRestriction
        ) as FormTypes,
        makeFormTypes(ApplicationStatusEnum.submitted)
      )
      const declineChange = result.changes.find((c) => c.label.toLowerCase().includes("decline"))
      expect(declineChange).toBeUndefined()
    })

    it("does not include decline reason when next reason is undefined", () => {
      const result = buildAppStatusConfirmSections(
        makeFormTypes(ApplicationStatusEnum.declined, undefined) as FormTypes,
        makeFormTypes(ApplicationStatusEnum.submitted)
      )
      const declineChange = result.changes.find((c) => c.label.toLowerCase().includes("decline"))
      expect(declineChange).toBeUndefined()
    })
  })

  describe("decline reason removals", () => {
    it("adds decline reason to removals when cleared while status stays declined", () => {
      const result = buildAppStatusConfirmSections(
        makeFormTypes(ApplicationStatusEnum.declined, undefined) as FormTypes,
        makeFormTypes(ApplicationStatusEnum.declined, ApplicationDeclineReasonEnum.other)
      )
      expect(result.changes.find((c) => c.label.toLowerCase().includes("decline"))).toBeUndefined()
      expect(result.removals.find((r) => r.label.toLowerCase().includes("decline"))).toBeDefined()
    })

    it("adds decline reason to removals when status changes away from declined", () => {
      const result = buildAppStatusConfirmSections(
        makeFormTypes(ApplicationStatusEnum.submitted) as FormTypes,
        makeFormTypes(ApplicationStatusEnum.declined, ApplicationDeclineReasonEnum.ageRestriction)
      )
      expect(result.removals.find((r) => r.label.toLowerCase().includes("decline"))).toBeDefined()
    })

    it("does not add to removals when there was no initial decline reason", () => {
      const result = buildAppStatusConfirmSections(
        makeFormTypes(ApplicationStatusEnum.submitted) as FormTypes,
        makeFormTypes(ApplicationStatusEnum.declined, undefined)
      )
      expect(result.removals.find((r) => r.label.toLowerCase().includes("decline"))).toBeUndefined()
    })

    it("does not add to removals when status stays declined and reason is unchanged", () => {
      const result = buildAppStatusConfirmSections(
        makeFormTypes(
          ApplicationStatusEnum.declined,
          ApplicationDeclineReasonEnum.other
        ) as FormTypes,
        makeFormTypes(ApplicationStatusEnum.declined, ApplicationDeclineReasonEnum.other)
      )
      expect(result.removals.find((r) => r.label.toLowerCase().includes("decline"))).toBeUndefined()
    })

    it("does not add to removals when reason is being replaced (goes into changes instead)", () => {
      const result = buildAppStatusConfirmSections(
        makeFormTypes(
          ApplicationStatusEnum.declined,
          ApplicationDeclineReasonEnum.incomeRestriction
        ) as FormTypes,
        makeFormTypes(ApplicationStatusEnum.declined, ApplicationDeclineReasonEnum.other)
      )
      expect(result.removals.find((r) => r.label.toLowerCase().includes("decline"))).toBeUndefined()
      expect(result.changes.find((c) => c.label.toLowerCase().includes("decline"))).toBeDefined()
    })
  })

  describe("waitlist number changes", () => {
    it("includes accessible waitlist number in changes when status is waitlist", () => {
      const result = buildAppStatusConfirmSections(
        makeFormTypes(ApplicationStatusEnum.waitlist, undefined, 3) as FormTypes,
        makeFormTypes(ApplicationStatusEnum.submitted)
      )
      const waitlistChange = result.changes.find((c) => c.value === "3")
      expect(waitlistChange).toBeDefined()
    })

    it("includes waitlist removals when transitioning away from waitlist status", () => {
      const result = buildAppStatusConfirmSections(
        makeFormTypes(ApplicationStatusEnum.submitted) as FormTypes,
        makeFormTypes(ApplicationStatusEnum.waitlist, undefined, 3)
      )
      expect(result.removals.length).toBeGreaterThan(0)
    })
  })

  describe("combined changes", () => {
    it("includes both status change and decline reason together", () => {
      const result = buildAppStatusConfirmSections(
        makeFormTypes(
          ApplicationStatusEnum.declined,
          ApplicationDeclineReasonEnum.unitRestriction
        ) as FormTypes,
        makeFormTypes(ApplicationStatusEnum.submitted)
      )
      expect(result.changes.length).toBe(2)
    })
  })
})
