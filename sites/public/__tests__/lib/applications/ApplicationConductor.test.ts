import {
  FeatureFlagEnum,
  MultiselectQuestionsApplicationSectionEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { blankApplication } from "@bloom-housing/shared-helpers"
import { mockNextRouter } from "../../testUtils"
import ApplicationConductor from "../../../src/lib/applications/ApplicationConductor"
import { retrieveApplicationConfig } from "../../../src/lib/applications/AppSubmissionContext"

const question = (id: string, applicationSection: MultiselectQuestionsApplicationSectionEnum) => ({
  ordinal: 1,
  multiselectQuestions: { id, text: id, applicationSection, options: [] },
})

// A listing with both question sections, so the config builds every conditional step.
const listingWithEverySection = {
  listingMultiselectQuestions: [
    question("pref", MultiselectQuestionsApplicationSectionEnum.preferences),
    question("prog", MultiselectQuestionsApplicationSectionEnum.programs),
  ],
}

const buildConductor = (
  { isAdvocate = false, featureFlags = [] } = {},
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  listing: any = listingWithEverySection
) => {
  const conductor = new ApplicationConductor(
    JSON.parse(JSON.stringify(blankApplication)) as Record<string, unknown>,
    listing
  )
  conductor.config = {
    ...retrieveApplicationConfig(listing, featureFlags),
    languages: [],
    featureFlags,
    isAdvocate,
  }
  return conductor
}

const askEveryStepWhetherToSkip = (conductor: ApplicationConductor) =>
  conductor.steps.forEach((step) => step.skipStep())

const definitionsReached = (conductor: ApplicationConductor) =>
  conductor.steps.map((step) => step.constructor.name)

describe("ApplicationConductor.prefetchNextUrl", () => {
  let prefetchMock: jest.Mock

  beforeEach(() => {
    prefetchMock = mockNextRouter().prefetchMock
  })

  it("warms the step the applicant is about to be sent to", () => {
    const conductor = buildConductor()
    conductor.stepTo("primaryApplicantName")

    conductor.prefetchNextUrl()

    expect(prefetchMock).toHaveBeenCalledWith("/applications/contact/address")
  })

  // An applicant editing an answer goes back to the summary, not on to the next step.
  it("warms the summary when the applicant is returning to review", () => {
    const conductor = buildConductor()
    conductor.stepTo("primaryApplicantName")
    conductor.returnToReview = true

    conductor.prefetchNextUrl()

    expect(prefetchMock).toHaveBeenCalledWith("/applications/review/summary")
  })

  it("asks for nothing on the last step", () => {
    const conductor = buildConductor()
    conductor.stepTo(conductor.steps[conductor.steps.length - 1].name)

    conductor.prefetchNextUrl()

    expect(prefetchMock).not.toHaveBeenCalled()
  })

  // This runs on mount, where a throw would take the step down.
  it("gives up quietly when the next url cannot be worked out", () => {
    const conductor = buildConductor()
    conductor.stepTo("primaryApplicantName")
    const warn = jest.spyOn(console, "warn").mockImplementation(() => undefined)
    conductor.steps[conductor.currentStepIndex + 1].skipStep = () => {
      throw new TypeError("Cannot read properties of undefined (reading 'filter')")
    }

    expect(() => conductor.prefetchNextUrl()).not.toThrow()
    expect(prefetchMock).not.toHaveBeenCalled()

    warn.mockRestore()
  })
})

// The prefetch asks every step whether to skip at mount, so deciding must not write.
describe("deciding whether to skip a step", () => {
  // communityTypes replaces programs behind a flag, so neither config alone builds every step.
  const withSwapOff = () => buildConductor()
  const withSwapOn = () =>
    buildConductor({
      featureFlags: [{ name: FeatureFlagEnum.swapCommunityTypeWithPrograms, active: true }],
    })

  // Without this the sweep below silently misses whichever definitions were never built.
  it("reaches every step definition in the routes table", () => {
    const reached = new Set([
      ...definitionsReached(withSwapOff()),
      ...definitionsReached(withSwapOn()),
    ])
    const declared = new Set(
      Object.values(ApplicationConductor["routes"] as Record<string, { definition?: unknown }>)
        .map((route) => (route.definition as { name?: string })?.name)
        .filter(Boolean)
    )

    expect([...declared].filter((name) => !reached.has(name))).toEqual([])
  })

  it("does not write to the application", () => {
    for (const conductor of [withSwapOff(), withSwapOn()]) {
      const before = JSON.stringify(conductor.application)

      askEveryStepWhetherToSkip(conductor)

      expect(JSON.stringify(conductor.application)).toEqual(before)
    }
  })

  // This step writes. It reads config, so the value doesn't differs.
  it("sets an advocate's alternate contact type and nothing else", () => {
    const conductor = buildConductor({ isAdvocate: true })
    const before = { ...conductor.application, alternateContact: null }

    askEveryStepWhetherToSkip(conductor)

    expect({ ...conductor.application, alternateContact: null }).toEqual(before)
    expect(conductor.application.alternateContact).toEqual({
      ...blankApplication.alternateContact,
      type: "caseManager",
    })
  })
})
