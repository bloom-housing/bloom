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

// Snapshot the real registry so tests can splice fixtures in and restore them.
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

  it("treats an omitted enabledRuleKeys as no rules enabled", () => {
    const redRule = buildRule("redRule", "red", true)
    stopLightRules.splice(0, stopLightRules.length, redRule)
    const { result } = renderHook(() => useStopLightGate(STEP, baseApplication, baseListing))
    const proceed = jest.fn()

    act(() => {
      result.current.guardSubmit({ householdSize: 3 }, proceed)
    })

    expect(proceed).toHaveBeenCalledTimes(1)
    expect(redRule.evaluate).not.toHaveBeenCalled()
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

  it("evaluates the draft application, not the saved one", () => {
    const application = { householdSize: 1, income: "0" } as Application
    const draftAware = buildRule(
      "draftAware",
      "red",
      (candidate: Application) => candidate.householdSize > 4 && candidate.income === "0"
    )
    const { result } = renderGate([draftAware], { application })
    const proceed = jest.fn()

    act(() => {
      result.current.guardSubmit({ householdSize: 5 }, proceed)
    })

    expect(draftAware.evaluate).toHaveBeenCalledWith({ householdSize: 5, income: "0" }, baseListing)
    expect(result.current.stopLights.redRules).toEqual([draftAware])
    // the gate previews the save, it must not perform it
    expect(application.householdSize).toBe(1)
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

    // without this the test would pass against a gate that never held the
    // submit at all, since proceed would already have run once
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

  it("ignores an acknowledge when nothing is pending", () => {
    const yellowRule = buildRule("yellowRule", "yellow", true)
    const { result } = renderGate([yellowRule])

    expect(() => {
      act(() => {
        result.current.stopLights.onAcknowledgeYellow()
      })
    }).not.toThrow()
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
    // red returns early, so the yellow rule is never even asked
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

    // without this the test passes even if dismissRed is a no-op, because the
    // second submit overwrites redRules anyway
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

    // without this the test passes even if cancelYellow is a no-op, because the
    // second submit repopulates yellowRules anyway
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

  it("runs the held submit only once when acknowledge fires twice in one batch", () => {
    const exactlyThree = buildRule(
      "exactlyThree",
      "yellow",
      (candidate: Application) => candidate.householdSize === 3
    )
    const { result } = renderGate([exactlyThree])
    const proceed = jest.fn()

    act(() => {
      result.current.guardSubmit({ householdSize: 3 }, proceed)
    })

    // both land before React flushes, so a guard reading render state cannot
    // stop the second one — proceed is save() plus routing, it must not double-run
    act(() => {
      result.current.stopLights.onAcknowledgeYellow()
      result.current.stopLights.onAcknowledgeYellow()
    })

    expect(proceed).toHaveBeenCalledTimes(1)
    expect(result.current.stopLights.yellowRules).toEqual([])
  })

  it("discards a held submit that a later submit superseded", () => {
    const exactlyThree = buildRule(
      "exactlyThree",
      "yellow",
      (candidate: Application) => candidate.householdSize === 3
    )
    const { result } = renderGate([exactlyThree])
    const held = jest.fn()
    const later = jest.fn()

    act(() => {
      result.current.guardSubmit({ householdSize: 3 }, held)
    })

    expect(result.current.stopLights.yellowRules).toEqual([exactlyThree])

    act(() => {
      result.current.guardSubmit({ householdSize: 9 }, later)
    })

    expect(later).toHaveBeenCalledTimes(1)

    // acknowledging the now-stale warning must not replay the first attempt
    act(() => {
      result.current.stopLights.onAcknowledgeYellow()
    })

    expect(held).not.toHaveBeenCalled()
    expect(result.current.stopLights.yellowRules).toEqual([])
  })

  it("does not replay a cancelled submit when acknowledge arrives afterwards", () => {
    const exactlyThree = buildRule(
      "exactlyThree",
      "yellow",
      (candidate: Application) => candidate.householdSize === 3
    )
    const { result } = renderGate([exactlyThree])
    const cancelled = jest.fn()

    act(() => {
      result.current.guardSubmit({ householdSize: 3 }, cancelled)
    })
    act(() => {
      result.current.stopLights.onCancelYellow()
    })

    // no intervening guardSubmit: its own latch reset would mask the leak
    act(() => {
      result.current.stopLights.onAcknowledgeYellow()
    })

    expect(cancelled).not.toHaveBeenCalled()
    expect(result.current.stopLights.yellowRules).toEqual([])
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

  it("evaluates nothing on mount without a deep-link key", () => {
    const redRule = buildRule("redRule", "red", true)
    const { result } = renderGate([redRule])

    expect(redRule.evaluate).not.toHaveBeenCalled()
    expect(result.current.stopLights.redRules).toEqual([])
  })

  it("opens the red modal when the deep-link key arrives after the first render", () => {
    const blocked = buildRule("blocked", "red", true)
    stopLightRules.splice(0, stopLightRules.length, blocked)
    const { result, rerender } = renderHook(
      ({ deepLinkRuleKey }: { deepLinkRuleKey?: string }) =>
        useStopLightGate(STEP, baseApplication, baseListing, ["blocked"], deepLinkRuleKey),
      { initialProps: {} as { deepLinkRuleKey?: string } }
    )

    // Next's router.query is routinely empty on the first client render, so the
    // redirect's ?blockedRule key arrives on a later one
    expect(result.current.stopLights.redRules).toEqual([])

    rerender({ deepLinkRuleKey: "blocked" })

    expect(result.current.stopLights.redRules).toEqual([blocked])
  })
})
