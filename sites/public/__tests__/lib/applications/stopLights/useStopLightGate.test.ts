import { act, renderHook } from "@testing-library/react"
import { Application, Listing } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import {
  StopLightColor,
  StopLightRule,
  stopLightRules,
} from "../../../../src/lib/applications/stopLights/stopLightRules"
import { useStopLightGate } from "../../../../src/lib/applications/stopLights/useStopLightGate"

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
    heading: `stopLights.${key}.heading`,
    body: `stopLights.${key}.body`,
  }
}

const renderGate = (
  rules: RuleFixture[],
  overrides: {
    step?: string
    application?: Application
    listing?: Listing
    enabledRuleKeys?: string[]
    deepLinkRuleKey?: string
  } = {}
) => {
  stopLightRules.splice(0, stopLightRules.length, ...rules)
  return renderHook(() =>
    useStopLightGate(
      overrides.step ?? STEP,
      overrides.application ?? baseApplication,
      overrides.listing ?? baseListing,
      overrides.enabledRuleKeys ?? rules.map((rule) => rule.key),
      overrides.deepLinkRuleKey
    )
  )
}

afterEach(() => {
  stopLightRules.splice(0, stopLightRules.length, ...registrySnapshot)
})

describe("useStopLightGate passthrough", () => {
  it("proceeds immediately when no rule targets the step", () => {
    const otherStepRule = buildRule("otherStepRule", "red", true, OTHER_STEP)
    const { result } = renderGate([otherStepRule])
    const proceed = jest.fn()

    act(() => {
      result.current.guardSubmit({ householdSize: 3 }, proceed)
    })

    expect(proceed).toHaveBeenCalledTimes(1)
    expect(otherStepRule.evaluate).not.toHaveBeenCalled()
    expect(result.current.stopLights.rule).toBeNull()
  })

  it("proceeds immediately when the step's rule is not enabled for the jurisdiction", () => {
    const disabledRule = buildRule("disabledRule", "red", true)
    const { result } = renderGate([disabledRule], { enabledRuleKeys: [] })
    const proceed = jest.fn()

    act(() => {
      result.current.guardSubmit({ householdSize: 3 }, proceed)
    })

    expect(proceed).toHaveBeenCalledTimes(1)
    expect(disabledRule.evaluate).not.toHaveBeenCalled()
    expect(result.current.stopLights.rule).toBeNull()
  })

  it("proceeds when an enabled red rule is evaluated but does not trigger", () => {
    const quietRed = buildRule("quietRed", "red", false)
    const { result } = renderGate([quietRed])
    const proceed = jest.fn()

    act(() => {
      result.current.guardSubmit({ householdSize: 3 }, proceed)
    })

    expect(proceed).toHaveBeenCalledTimes(1)
    expect(quietRed.evaluate).toHaveBeenCalledTimes(1)
    expect(result.current.stopLights.rule).toBeNull()
  })

  it("evaluates the rule against the pending save merged onto the application", () => {
    const tooBig = buildRule(
      "tooBig",
      "red",
      (candidate: Application) => candidate.householdSize > 4
    )
    const { result } = renderGate([tooBig], { application: { householdSize: 1 } as Application })
    const proceed = jest.fn()

    act(() => {
      result.current.guardSubmit({ householdSize: 5 }, proceed)
    })

    expect(proceed).not.toHaveBeenCalled()
    expect(result.current.stopLights.rule).toEqual(tooBig)
  })
})

describe("useStopLightGate red light", () => {
  it("blocks the submit and exposes the triggered red rule", () => {
    const redRule = buildRule("redRule", "red", true)
    const { result } = renderGate([redRule])
    const proceed = jest.fn()

    act(() => {
      result.current.guardSubmit({ householdSize: 3 }, proceed)
    })

    expect(proceed).not.toHaveBeenCalled()
    expect(result.current.stopLights.rule).toEqual(redRule)
  })

  it("does not hold a submit to resume, so acknowledging does nothing", () => {
    const redRule = buildRule("redRule", "red", true)
    const { result } = renderGate([redRule])
    const proceed = jest.fn()

    act(() => {
      result.current.guardSubmit({ householdSize: 3 }, proceed)
    })
    act(() => {
      result.current.stopLights.onAcknowledgeYellow()
    })

    expect(proceed).not.toHaveBeenCalled()
    expect(result.current.stopLights.rule).toEqual(redRule)
  })
})

describe("useStopLightGate yellow light", () => {
  it("warns without proceeding when the yellow rule triggers", () => {
    const yellowRule = buildRule("yellowRule", "yellow", true)
    const { result } = renderGate([yellowRule])
    const proceed = jest.fn()

    act(() => {
      result.current.guardSubmit({ householdSize: 3 }, proceed)
    })

    expect(proceed).not.toHaveBeenCalled()
    expect(result.current.stopLights.rule).toEqual(yellowRule)
  })

  it("runs the held submit once the warning is acknowledged", () => {
    const yellowRule = buildRule("yellowRule", "yellow", true)
    const { result } = renderGate([yellowRule])
    const proceed = jest.fn()

    act(() => {
      result.current.guardSubmit({ householdSize: 3 }, proceed)
    })

    expect(proceed).not.toHaveBeenCalled()

    act(() => {
      result.current.stopLights.onAcknowledgeYellow()
    })

    expect(proceed).toHaveBeenCalledTimes(1)
    expect(result.current.stopLights.rule).toBeNull()
  })

  it("does not run the held submit a second time on a repeat acknowledge", () => {
    const yellowRule = buildRule("yellowRule", "yellow", true)
    const { result } = renderGate([yellowRule])
    const proceed = jest.fn()

    act(() => {
      result.current.guardSubmit({ householdSize: 3 }, proceed)
    })
    act(() => {
      result.current.stopLights.onAcknowledgeYellow()
    })
    act(() => {
      result.current.stopLights.onAcknowledgeYellow()
    })

    expect(proceed).toHaveBeenCalledTimes(1)
  })

  it("proceeds when an enabled yellow rule is evaluated but does not trigger", () => {
    const quietYellow = buildRule("quietYellow", "yellow", false)
    const { result } = renderGate([quietYellow])
    const proceed = jest.fn()

    act(() => {
      result.current.guardSubmit({ householdSize: 3 }, proceed)
    })

    expect(proceed).toHaveBeenCalledTimes(1)
    expect(quietYellow.evaluate).toHaveBeenCalledTimes(1)
    expect(result.current.stopLights.rule).toBeNull()
  })

  it("drops the held submit on cancel", () => {
    const yellowRule = buildRule("yellowRule", "yellow", true)
    const { result } = renderGate([yellowRule])
    const proceed = jest.fn()

    act(() => {
      result.current.guardSubmit({ householdSize: 3 }, proceed)
    })
    act(() => {
      result.current.stopLights.onCancelYellow()
    })

    expect(proceed).not.toHaveBeenCalled()
    expect(result.current.stopLights.rule).toBeNull()

    act(() => {
      result.current.stopLights.onAcknowledgeYellow()
    })

    expect(proceed).not.toHaveBeenCalled()
  })
})

describe("useStopLightGate re-triggering", () => {
  it("shows the red rule again when the answer still trips it", () => {
    const tooBig = buildRule(
      "tooBig",
      "red",
      (candidate: Application) => candidate.householdSize > 4
    )
    const { result } = renderGate([tooBig])
    const proceed = jest.fn()

    act(() => {
      result.current.guardSubmit({ householdSize: 5 }, proceed)
    })
    act(() => {
      result.current.stopLights.onEditRed()
    })

    expect(result.current.stopLights.rule).toBeNull()

    act(() => {
      result.current.guardSubmit({ householdSize: 5 }, proceed)
    })

    expect(result.current.stopLights.rule).toEqual(tooBig)
    expect(proceed).not.toHaveBeenCalled()
  })

  it("proceeds once the red answer is corrected after a dismiss", () => {
    const tooBig = buildRule(
      "tooBig",
      "red",
      (candidate: Application) => candidate.householdSize > 4
    )
    const { result } = renderGate([tooBig])
    const proceed = jest.fn()

    act(() => {
      result.current.guardSubmit({ householdSize: 5 }, proceed)
    })
    act(() => {
      result.current.stopLights.onEditRed()
    })
    act(() => {
      result.current.guardSubmit({ householdSize: 3 }, proceed)
    })

    expect(proceed).toHaveBeenCalledTimes(1)
    expect(result.current.stopLights.rule).toBeNull()
  })

  it("re-evaluates yellow from scratch after a cancel", () => {
    const noIncome = buildRule(
      "noIncome",
      "yellow",
      (candidate: Application) => candidate.householdSize === 3
    )
    const { result } = renderGate([noIncome])
    const proceed = jest.fn()

    act(() => {
      result.current.guardSubmit({ householdSize: 3 }, proceed)
    })
    act(() => {
      result.current.stopLights.onCancelYellow()
    })

    expect(result.current.stopLights.rule).toBeNull()

    act(() => {
      result.current.guardSubmit({ householdSize: 3 }, proceed)
    })

    expect(result.current.stopLights.rule).toEqual(noIncome)
    expect(proceed).not.toHaveBeenCalled()

    act(() => {
      result.current.stopLights.onAcknowledgeYellow()
    })

    expect(proceed).toHaveBeenCalledTimes(1)
  })

  it("proceeds without a warning once the yellow answer is corrected after a cancel", () => {
    const noIncome = buildRule(
      "noIncome",
      "yellow",
      (candidate: Application) => candidate.householdSize === 3
    )
    const { result } = renderGate([noIncome])
    const proceed = jest.fn()

    act(() => {
      result.current.guardSubmit({ householdSize: 3 }, proceed)
    })
    act(() => {
      result.current.stopLights.onCancelYellow()
    })
    act(() => {
      result.current.guardSubmit({ householdSize: 2 }, proceed)
    })

    expect(proceed).toHaveBeenCalledTimes(1)
    expect(result.current.stopLights.rule).toBeNull()
  })
})

describe("useStopLightGate deep link", () => {
  it("opens the red modal on mount when the rule still trips", () => {
    const blocked = buildRule("blocked", "red", true)
    const { result } = renderGate([blocked], { deepLinkRuleKey: "blocked" })

    expect(result.current.stopLights.rule).toEqual(blocked)
    expect(blocked.evaluate).toHaveBeenCalledWith(baseApplication, baseListing)
  })

  it("opens nothing when the rule no longer trips", () => {
    const fixed = buildRule("fixed", "red", false)
    const { result } = renderGate([fixed], { deepLinkRuleKey: "fixed" })

    expect(fixed.evaluate).toHaveBeenCalledTimes(1)
    expect(result.current.stopLights.rule).toBeNull()
  })

  it("ignores a key naming a yellow rule", () => {
    const yellowRule = buildRule("yellowRule", "yellow", true)
    const { result } = renderGate([yellowRule], { deepLinkRuleKey: "yellowRule" })

    expect(yellowRule.evaluate).not.toHaveBeenCalled()
    expect(result.current.stopLights.rule).toBeNull()
  })

  it("ignores a key the jurisdiction has not enabled", () => {
    const disabledRule = buildRule("disabledRule", "red", true)
    const { result } = renderGate([disabledRule], {
      enabledRuleKeys: [],
      deepLinkRuleKey: "disabledRule",
    })

    expect(disabledRule.evaluate).not.toHaveBeenCalled()
    expect(result.current.stopLights.rule).toBeNull()
  })

  it("ignores a key that does not match the step's rule", () => {
    const stepRule = buildRule("stepRule", "red", true)
    const { result } = renderGate([stepRule], { deepLinkRuleKey: "someOtherRule" })

    expect(stepRule.evaluate).not.toHaveBeenCalled()
    expect(result.current.stopLights.rule).toBeNull()
  })
})
