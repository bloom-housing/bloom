import { act, renderHook } from "@testing-library/react"
import { Application, Listing } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import {
  StopLightColor,
  StopLightRule,
  stopLightRules,
} from "../../../../src/lib/applications/stopLights/stopLightRules"
import { useStopLightBanners } from "../../../../src/lib/applications/stopLights/useStopLightBanners"

const STEP = "primaryApplicantName"
const OTHER_STEP = "income"

const registrySnapshot = [...stopLightRules]

const baseApplication = { householdSize: 1 } as Application
const baseListing = {} as Listing

type RuleFixture = Omit<StopLightRule, "evaluate"> & {
  evaluate: jest.MockedFunction<StopLightRule["evaluate"]>
}

const buildRule = (
  key: string,
  light: StopLightColor,
  triggers: boolean | StopLightRule["evaluate"],
  step: string = STEP
): RuleFixture => {
  const evaluator: StopLightRule["evaluate"] =
    typeof triggers === "function" ? triggers : () => triggers
  return {
    key,
    step,
    light,
    evaluate: jest.fn(evaluator),
    modalTitle: `stopLights.${key}.modalTitle`,
    alertTitle: `stopLights.${key}.alertTitle`,
    body: `stopLights.${key}.body`,
  }
}

const renderBanners = (
  rules: RuleFixture[],
  overrides: {
    step?: string
    application?: Application
    listing?: Listing
    enabledRuleKeys?: string[]
    getValues?: jest.Mock<Partial<Application>, []>
  } = {}
) => {
  stopLightRules.splice(0, stopLightRules.length, ...rules)
  const getValues = overrides.getValues ?? jest.fn<Partial<Application>, []>(() => ({}))
  const hook = renderHook(() =>
    useStopLightBanners(
      overrides.step ?? STEP,
      overrides.application ?? baseApplication,
      overrides.listing ?? baseListing,
      overrides.enabledRuleKeys ?? rules.map((rule) => rule.key),
      getValues
    )
  )
  return { ...hook, getValues }
}

afterEach(() => {
  stopLightRules.splice(0, stopLightRules.length, ...registrySnapshot)
})

describe("useStopLightBanners clean blur", () => {
  it("does nothing when no rule targets the step", () => {
    const otherStepRule = buildRule("otherStepRule", "red", true, OTHER_STEP)
    const { result, getValues } = renderBanners([otherStepRule])

    act(() => {
      result.current.onFieldBlur()
    })

    expect(result.current.banner).toBeNull()
    expect(getValues).not.toHaveBeenCalled()
    expect(otherStepRule.evaluate).not.toHaveBeenCalled()
  })

  it("does not show a banner when the rule is evaluated but does not trigger", () => {
    const quietRule = buildRule("quietRule", "red", false)
    const { result } = renderBanners([quietRule])

    act(() => {
      result.current.onFieldBlur()
    })

    expect(quietRule.evaluate).toHaveBeenCalledTimes(1)
    expect(result.current.banner).toBeNull()
  })
})

describe("useStopLightBanners triggering blur", () => {
  it.each<StopLightColor>(["red", "yellow"])("sets the banner to a triggered %s rule", (light) => {
    const rule = buildRule(`${light}Rule`, light, true)
    const { result } = renderBanners([rule])

    act(() => {
      result.current.onFieldBlur()
    })

    expect(result.current.banner).toEqual(rule)
  })

  it("clears the banner when the answer is corrected and the field is blurred again", () => {
    const tooBig = buildRule(
      "tooBig",
      "red",
      (candidate: Application) => candidate.householdSize > 4
    )
    const getValues = jest.fn<Partial<Application>, []>(() => ({ householdSize: 5 }))
    const { result } = renderBanners([tooBig], { getValues })

    act(() => {
      result.current.onFieldBlur()
    })
    expect(result.current.banner).toEqual(tooBig)

    getValues.mockReturnValue({ householdSize: 2 })
    act(() => {
      result.current.onFieldBlur()
    })
    expect(result.current.banner).toBeNull()
  })
})

describe("useStopLightBanners typing without blur", () => {
  it("never evaluates or updates the banner when values change without a blur", () => {
    const tooBig = buildRule(
      "tooBig",
      "red",
      (candidate: Application) => candidate.householdSize > 4
    )
    const getValues = jest.fn<Partial<Application>, []>(() => ({ householdSize: 1 }))
    const { result, rerender } = renderBanners([tooBig], { getValues })

    getValues.mockReturnValue({ householdSize: 5 })
    rerender()
    getValues.mockReturnValue({ householdSize: 9 })
    rerender()

    expect(getValues).not.toHaveBeenCalled()
    expect(tooBig.evaluate).not.toHaveBeenCalled()
    expect(result.current.banner).toBeNull()
  })

  it("keeps a shown banner unchanged until the next blur", () => {
    const tooBig = buildRule(
      "tooBig",
      "red",
      (candidate: Application) => candidate.householdSize > 4
    )
    const getValues = jest.fn<Partial<Application>, []>(() => ({ householdSize: 5 }))
    const { result, rerender } = renderBanners([tooBig], { getValues })

    act(() => {
      result.current.onFieldBlur()
    })
    getValues.mockReturnValue({ householdSize: 2 })
    rerender()

    expect(tooBig.evaluate).toHaveBeenCalledTimes(1)
    expect(result.current.banner).toEqual(tooBig)
  })
})
