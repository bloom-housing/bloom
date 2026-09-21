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
    modalTitle: `stopLights.${key}.modalTitle`,
    alertTitle: `stopLights.${key}.alertTitle`,
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
    expect(result.current.stopLights.redRules).toEqual([])
    expect(result.current.stopLights.yellowRules).toEqual([])
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
    expect(result.current.stopLights.redRules).toEqual([])
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
    expect(result.current.stopLights.redRules).toEqual([])
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
    expect(result.current.stopLights.redRules).toEqual([redRule])
    expect(result.current.stopLights.yellowRules).toEqual([])
  })

  it("collects every triggered red rule in a single pass", () => {
    const firstRed = buildRule("firstRed", "red", true)
    const secondRed = buildRule("secondRed", "red", true)
    const quietRed = buildRule("quietRed", "red", false)
    const { result } = renderGate([firstRed, secondRed, quietRed])
    const proceed = jest.fn()

    act(() => {
      result.current.guardSubmit({ householdSize: 3 }, proceed)
    })

    expect(proceed).not.toHaveBeenCalled()
    expect(result.current.stopLights.redRules).toEqual([firstRed, secondRed])
  })
})

describe("useStopLightGate yellow light", () => {
  it("warns without proceeding when a yellow rule triggers", () => {
    const yellowRule = buildRule("yellowRule", "yellow", true)
    const { result } = renderGate([yellowRule])
    const proceed = jest.fn()

    act(() => {
      result.current.guardSubmit({ householdSize: 3 }, proceed)
    })

    expect(proceed).not.toHaveBeenCalled()
    expect(result.current.stopLights.yellowRules).toEqual([yellowRule])
    expect(result.current.stopLights.redRules).toEqual([])
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
    expect(result.current.stopLights.yellowRules).toEqual([])
  })

  it("shows every triggered yellow rule at once and clears them in one acknowledge", () => {
    const firstYellow = buildRule("firstYellow", "yellow", true)
    const secondYellow = buildRule("secondYellow", "yellow", true)
    const quietYellow = buildRule("quietYellow", "yellow", false)
    const { result } = renderGate([firstYellow, secondYellow, quietYellow])
    const proceed = jest.fn()

    act(() => {
      result.current.guardSubmit({ householdSize: 3 }, proceed)
    })

    expect(result.current.stopLights.yellowRules).toEqual([firstYellow, secondYellow])

    act(() => {
      result.current.stopLights.onAcknowledgeYellow()
    })

    expect(proceed).toHaveBeenCalledTimes(1)
    expect(result.current.stopLights.yellowRules).toEqual([])
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
    expect(result.current.stopLights.yellowRules).toEqual([])
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
    expect(result.current.stopLights.yellowRules).toEqual([])
  })
})

describe("useStopLightGate color precedence", () => {
  it("shows only red when both colors trigger on the same submit", () => {
    const redRule = buildRule("redRule", "red", true)
    const yellowRule = buildRule("yellowRule", "yellow", true)
    const { result } = renderGate([redRule, yellowRule])
    const proceed = jest.fn()

    act(() => {
      result.current.guardSubmit({ householdSize: 3 }, proceed)
    })

    expect(proceed).not.toHaveBeenCalled()
    expect(result.current.stopLights.redRules).toEqual([redRule])
    expect(result.current.stopLights.yellowRules).toEqual([])
    expect(yellowRule.evaluate).not.toHaveBeenCalled()
  })
})

describe("useStopLightGate re-triggering", () => {
  it("shows the same red rule again when the answer still trips it", () => {
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

    expect(result.current.stopLights.redRules).toEqual([])

    act(() => {
      result.current.guardSubmit({ householdSize: 5 }, proceed)
    })

    expect(result.current.stopLights.redRules).toEqual([tooBig])
    expect(proceed).not.toHaveBeenCalled()
  })

  it("swaps in a different red rule rather than replaying the dismissed one", () => {
    const tooBig = buildRule(
      "tooBig",
      "red",
      (candidate: Application) => candidate.householdSize > 4
    )
    const empty = buildRule(
      "empty",
      "red",
      (candidate: Application) => candidate.householdSize === 0
    )
    const { result } = renderGate([tooBig, empty])
    const proceed = jest.fn()

    act(() => {
      result.current.guardSubmit({ householdSize: 5 }, proceed)
    })

    expect(result.current.stopLights.redRules).toEqual([tooBig])

    act(() => {
      result.current.stopLights.onEditRed()
    })

    expect(result.current.stopLights.redRules).toEqual([])

    act(() => {
      result.current.guardSubmit({ householdSize: 0 }, proceed)
    })

    expect(result.current.stopLights.redRules).toEqual([empty])
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

    expect(result.current.stopLights.yellowRules).toEqual([])

    act(() => {
      result.current.guardSubmit({ householdSize: 3 }, proceed)
    })

    expect(result.current.stopLights.yellowRules).toEqual([noIncome])
    expect(proceed).not.toHaveBeenCalled()

    act(() => {
      result.current.stopLights.onAcknowledgeYellow()
    })

    expect(proceed).toHaveBeenCalledTimes(1)
  })

  it("surfaces a newly triggered yellow once the red answer is fixed", () => {
    const tooBig = buildRule(
      "tooBig",
      "red",
      (candidate: Application) => candidate.householdSize > 4
    )
    const exactlyThree = buildRule(
      "exactlyThree",
      "yellow",
      (candidate: Application) => candidate.householdSize === 3
    )
    const { result } = renderGate([tooBig, exactlyThree])
    const proceed = jest.fn()

    act(() => {
      result.current.guardSubmit({ householdSize: 5 }, proceed)
    })

    expect(result.current.stopLights.redRules).toEqual([tooBig])

    act(() => {
      result.current.stopLights.onEditRed()
    })
    act(() => {
      result.current.guardSubmit({ householdSize: 3 }, proceed)
    })

    expect(result.current.stopLights.redRules).toEqual([])
    expect(result.current.stopLights.yellowRules).toEqual([exactlyThree])
    expect(proceed).not.toHaveBeenCalled()
  })
})

describe("useStopLightGate deep link", () => {
  it("opens the red modal on mount when the rule still trips", () => {
    const blocked = buildRule("blocked", "red", true)
    const { result } = renderGate([blocked], { deepLinkRuleKey: "blocked" })

    expect(result.current.stopLights.redRules).toEqual([blocked])
    expect(blocked.evaluate).toHaveBeenCalledWith(baseApplication, baseListing)
  })

  it("opens nothing when the rule no longer trips", () => {
    const fixed = buildRule("fixed", "red", false)
    const { result } = renderGate([fixed], { deepLinkRuleKey: "fixed" })

    expect(fixed.evaluate).toHaveBeenCalledTimes(1)
    expect(result.current.stopLights.redRules).toEqual([])
  })

  it("ignores a key naming a yellow rule", () => {
    const yellowRule = buildRule("yellowRule", "yellow", true)
    const { result } = renderGate([yellowRule], { deepLinkRuleKey: "yellowRule" })

    expect(yellowRule.evaluate).not.toHaveBeenCalled()
    expect(result.current.stopLights.redRules).toEqual([])
    expect(result.current.stopLights.yellowRules).toEqual([])
  })

  it("ignores a key the jurisdiction has not enabled", () => {
    const disabledRule = buildRule("disabledRule", "red", true)
    const { result } = renderGate([disabledRule], {
      enabledRuleKeys: [],
      deepLinkRuleKey: "disabledRule",
    })

    expect(disabledRule.evaluate).not.toHaveBeenCalled()
    expect(result.current.stopLights.redRules).toEqual([])
  })
})
