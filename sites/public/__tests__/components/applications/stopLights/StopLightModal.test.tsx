import React, { useState } from "react"
import userEvent from "@testing-library/user-event"
import { addTranslation } from "@bloom-housing/ui-components"
import { StopLightRule } from "../../../../src/lib/applications/stopLights/stopLightRules"
import {
  RedLightModal,
  YellowLightModal,
} from "../../../../src/components/applications/stopLights/StopLightModal"
import { useRouter } from "next/router"
import { render, screen, waitFor } from "../../../testUtils"

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}))

const redRuleFixture = (overrides: Partial<StopLightRule> = {}): StopLightRule => ({
  key: "ruleOne",
  step: "primaryApplicantName",
  light: "red",
  evaluate: () => true,
  modalTitle: "stopLights.ruleOne.modalTitle",
  alertTitle: "stopLights.ruleOne.alertTitle",
  body: "stopLights.ruleOne.body",
  ...overrides,
})

const yellowRuleFixture = (overrides: Partial<StopLightRule> = {}): StopLightRule =>
  redRuleFixture({ light: "yellow", ...overrides })

const nextFrame = () => new Promise((resolve) => window.requestAnimationFrame(() => resolve(null)))

const RedHarness = (props: {
  rule: StopLightRule | null
  onEdit: () => void
  onReturnToListings?: () => void
}) => {
  const [isOpen, setIsOpen] = useState(true)
  return (
    <>
      <fieldset>
        <legend>Your date of birth</legend>
        <input id="test.anchor" aria-label="Month" />
      </fieldset>
      <RedLightModal
        isOpen={isOpen}
        rule={props.rule}
        onEdit={() => {
          setIsOpen(false)
          props.onEdit()
        }}
        onReturnToListings={props.onReturnToListings ?? jest.fn()}
      />
    </>
  )
}

const YellowHarness = (props: {
  rule: StopLightRule | null
  onCancel: () => void
  onAcknowledge: () => void
}) => {
  const [isOpen, setIsOpen] = useState(true)
  return (
    <YellowLightModal
      isOpen={isOpen}
      rule={props.rule}
      onCancel={() => {
        setIsOpen(false)
        props.onCancel()
      }}
      onAcknowledge={() => {
        setIsOpen(false)
        props.onAcknowledge()
      }}
    />
  )
}

describe("StopLightModal", () => {
  beforeAll(() => {
    addTranslation({
      "stopLights.ruleOne.modalTitle": "Rule one modal title",
      "stopLights.ruleOne.alertTitle": "Rule one alert title",
      "stopLights.ruleOne.body": "Rule one body",
      "stopLights.updateAnswer": "Update my answer",
      "stopLights.returnToListing": "Return to listings",
      "stopLights.continue": "I understand — continue",
    })
  })

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue({ push: jest.fn(), locale: "en", query: {} })
  })

  describe("red light", () => {
    const onEdit = jest.fn()

    it("renders the rule's modal title as the header, and its alert title and body in one alert", () => {
      render(<RedHarness rule={redRuleFixture()} onEdit={onEdit} />)

      expect(
        screen.getByRole("heading", { level: 1, name: "Rule one modal title" })
      ).toBeInTheDocument()

      const lead = screen.getByText("Rule one alert title")
      expect(lead.tagName).toBe("STRONG")

      const alert = lead.closest(".seeds-message")
      expect(alert).not.toBeNull()
      expect(alert).toHaveAttribute("data-variant", "alert")
      expect(alert.textContent).toContain("Rule one alert title Rule one body")
      expect(screen.getByText("Rule one body").tagName).toBe("P")

      expect(screen.getByRole("button", { name: "Update my answer" })).toBeInTheDocument()
      expect(screen.getByRole("button", { name: "Return to listings" })).toBeInTheDocument()
    })

    // the gate clears its rule on dismiss, so the layout hands the modal a null rule
    it("renders nothing when there is no rule", () => {
      render(<RedHarness rule={null} onEdit={onEdit} />)

      expect(screen.queryByRole("heading", { level: 1 })).not.toBeInTheDocument()
      expect(document.querySelectorAll(".seeds-message")).toHaveLength(0)
      expect(screen.queryByRole("button", { name: "Update my answer" })).not.toBeInTheDocument()
      expect(screen.queryByRole("button", { name: "Return to listings" })).not.toBeInTheDocument()
    })

    it("calls onEdit and moves focus into the anchored field when Edit is clicked", async () => {
      render(
        <RedHarness rule={redRuleFixture({ editFieldAnchor: "test.anchor" })} onEdit={onEdit} />
      )

      await userEvent.click(screen.getByRole("button", { name: "Update my answer" }))

      expect(onEdit).toHaveBeenCalledTimes(1)
      await waitFor(() => expect(screen.getByLabelText("Month")).toHaveFocus())
    })

    it("closes without moving focus when no rule declares an anchor", async () => {
      render(<RedHarness rule={redRuleFixture()} onEdit={onEdit} />)

      await userEvent.click(screen.getByRole("button", { name: "Update my answer" }))
      await nextFrame()

      expect(onEdit).toHaveBeenCalledTimes(1)
      expect(screen.getByLabelText("Month")).not.toHaveFocus()
    })

    // where "Return to listings" actually navigates (the specific listing, or a fallback
    // to the browse page) is decided by the layout, which owns the conductor's listing;
    // see application-form.test.tsx
    it("calls onReturnToListings, and not onEdit, when Return to listings is clicked", async () => {
      const onReturnToListings = jest.fn()
      render(
        <RedHarness
          rule={redRuleFixture()}
          onEdit={onEdit}
          onReturnToListings={onReturnToListings}
        />
      )

      await userEvent.click(screen.getByRole("button", { name: "Return to listings" }))

      expect(onReturnToListings).toHaveBeenCalledTimes(1)
      expect(onEdit).not.toHaveBeenCalled()
    })
  })

  describe("yellow light", () => {
    const onCancel = jest.fn()
    const onAcknowledge = jest.fn()

    it("renders the rule's modal title as the header, and its alert title and body in one alert", () => {
      render(
        <YellowHarness
          rule={yellowRuleFixture()}
          onCancel={onCancel}
          onAcknowledge={onAcknowledge}
        />
      )

      expect(
        screen.getByRole("heading", { level: 1, name: "Rule one modal title" })
      ).toBeInTheDocument()

      const lead = screen.getByText("Rule one alert title")
      expect(lead.tagName).toBe("STRONG")

      const alert = lead.closest(".seeds-message")
      expect(alert).not.toBeNull()
      expect(alert).toHaveAttribute("data-variant", "warn")
      expect(alert.textContent).toContain("Rule one alert title Rule one body")

      expect(screen.getByRole("button", { name: "Update my answer" })).toBeInTheDocument()
      expect(screen.getByRole("button", { name: "I understand — continue" })).toBeInTheDocument()
    })

    // the gate clears its rule on acknowledge or cancel, so the layout hands the modal a null rule
    it("renders nothing when there is no rule", () => {
      render(<YellowHarness rule={null} onCancel={onCancel} onAcknowledge={onAcknowledge} />)

      expect(screen.queryByRole("heading", { level: 1 })).not.toBeInTheDocument()
      expect(document.querySelectorAll(".seeds-message")).toHaveLength(0)
      expect(screen.queryByRole("button", { name: "Update my answer" })).not.toBeInTheDocument()
      expect(
        screen.queryByRole("button", { name: "I understand — continue" })
      ).not.toBeInTheDocument()
    })

    it("calls onAcknowledge, and not onCancel, when Continue is clicked", async () => {
      render(
        <YellowHarness
          rule={yellowRuleFixture()}
          onCancel={onCancel}
          onAcknowledge={onAcknowledge}
        />
      )

      await userEvent.click(screen.getByRole("button", { name: "I understand — continue" }))

      expect(onAcknowledge).toHaveBeenCalledTimes(1)
      expect(onCancel).not.toHaveBeenCalled()
    })

    it("calls onCancel, and not onAcknowledge, when Update my answer is clicked", async () => {
      render(
        <YellowHarness
          rule={yellowRuleFixture()}
          onCancel={onCancel}
          onAcknowledge={onAcknowledge}
        />
      )

      await userEvent.click(screen.getByRole("button", { name: "Update my answer" }))

      expect(onCancel).toHaveBeenCalledTimes(1)
      expect(onAcknowledge).not.toHaveBeenCalled()
    })
  })
})
