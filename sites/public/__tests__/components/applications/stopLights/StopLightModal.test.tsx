import React, { useState } from "react"
import userEvent from "@testing-library/user-event"
import { addTranslation } from "@bloom-housing/ui-components"
import { StopLightRule } from "../../../../src/lib/applications/stopLights/stopLightRules"
import { StopLightModal } from "../../../../src/components/applications/stopLights/StopLightModal"
import { useRouter } from "next/router"
import { render, screen, waitFor, within } from "../../../testUtils"

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

const flushDeferredFocus = async () => {
  await nextFrame()
  await new Promise((resolve) => window.setTimeout(resolve, 0))
}

const RedHarness = (props: { rules: StopLightRule[]; onEdit: () => void }) => {
  const [isOpen, setIsOpen] = useState(true)
  return (
    <>
      <fieldset>
        <legend>Your date of birth</legend>
        <input id="test.anchor" aria-label="Month" />
      </fieldset>
      <StopLightModal
        light="red"
        isOpen={isOpen}
        rules={props.rules}
        onEdit={() => {
          setIsOpen(false)
          props.onEdit()
        }}
      />
    </>
  )
}

const YellowHarness = (props: {
  rules: StopLightRule[]
  onCancel: () => void
  onAcknowledge: () => void
}) => {
  const [isOpen, setIsOpen] = useState(true)
  return (
    <StopLightModal
      light="yellow"
      isOpen={isOpen}
      rules={props.rules}
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
      "stopLights.ruleTwo.modalTitle": "Rule two modal title",
      "stopLights.ruleTwo.alertTitle": "Rule two alert title",
      "stopLights.ruleTwo.body": "Rule two body",
      "stopLights.updateAnswer": "Update my answer",
      "stopLights.returnToListing": "Return to listings",
      "stopLights.continue": "I understand — continue",
    })
  })

  const mockPush = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue({ push: mockPush, locale: "en", query: {} })
  })

  describe("red light", () => {
    const onEdit = jest.fn()

    it("renders the rule's modal title as the header, and its alert title and body in one alert", () => {
      render(<RedHarness rules={[redRuleFixture()]} onEdit={onEdit} />)

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

    it("renders only the first rule and leaves the rest off the screen", () => {
      render(
        <RedHarness
          rules={[
            redRuleFixture(),
            redRuleFixture({
              key: "ruleTwo",
              modalTitle: "stopLights.ruleTwo.modalTitle",
              alertTitle: "stopLights.ruleTwo.alertTitle",
              body: "stopLights.ruleTwo.body",
            }),
          ]}
          onEdit={onEdit}
        />
      )

      expect(
        screen.getByRole("heading", { level: 1, name: "Rule one modal title" })
      ).toBeInTheDocument()
      expect(screen.queryByText("Rule two modal title")).not.toBeInTheDocument()

      expect(document.querySelectorAll(".seeds-message")).toHaveLength(1)
      expect(screen.getByText("Rule one alert title")).toBeInTheDocument()
      expect(screen.getByText("Rule one body")).toBeInTheDocument()
      expect(screen.queryByText("Rule two alert title")).not.toBeInTheDocument()
      expect(screen.queryByText("Rule two body")).not.toBeInTheDocument()
      expect(screen.getAllByRole("button", { name: "Update my answer" })).toHaveLength(1)
    })

    it("calls onEdit and moves focus into the anchored field when Edit is clicked", async () => {
      render(
        <RedHarness rules={[redRuleFixture({ editFieldAnchor: "test.anchor" })]} onEdit={onEdit} />
      )

      await userEvent.click(screen.getByRole("button", { name: "Update my answer" }))

      expect(onEdit).toHaveBeenCalledTimes(1)
      await waitFor(() => expect(screen.getByLabelText("Month")).toHaveFocus())
    })

    it("does not focus the anchor of a rule it did not display", async () => {
      render(
        <RedHarness
          rules={[
            redRuleFixture(),
            redRuleFixture({ key: "ruleTwo", editFieldAnchor: "test.anchor" }),
          ]}
          onEdit={onEdit}
        />
      )

      await userEvent.click(screen.getByRole("button", { name: "Update my answer" }))
      await flushDeferredFocus()

      expect(onEdit).toHaveBeenCalledTimes(1)
      expect(screen.getByLabelText("Month")).not.toHaveFocus()
    })

    it("closes without moving focus when no rule declares an anchor", async () => {
      render(<RedHarness rules={[redRuleFixture()]} onEdit={onEdit} />)

      await userEvent.click(screen.getByRole("button", { name: "Update my answer" }))
      await nextFrame()

      expect(onEdit).toHaveBeenCalledTimes(1)
      expect(screen.getByLabelText("Month")).not.toHaveFocus()
    })

    it("routes to the listings browse page, and does not edit, on Return to listings", async () => {
      render(<RedHarness rules={[redRuleFixture()]} onEdit={onEdit} />)

      await userEvent.click(screen.getByRole("button", { name: "Return to listings" }))

      expect(mockPush).toHaveBeenCalledTimes(1)
      expect(mockPush).toHaveBeenCalledWith("/en/listings")
      expect(onEdit).not.toHaveBeenCalled()
    })
  })

  describe("yellow light", () => {
    const onCancel = jest.fn()
    const onAcknowledge = jest.fn()

    it("renders the rule's modal title as the header, and its alert title and body in one alert", () => {
      render(
        <YellowHarness
          rules={[yellowRuleFixture()]}
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

    it("renders only the first rule and leaves the rest off the screen", () => {
      render(
        <YellowHarness
          rules={[
            yellowRuleFixture(),
            yellowRuleFixture({
              key: "ruleTwo",
              modalTitle: "stopLights.ruleTwo.modalTitle",
              alertTitle: "stopLights.ruleTwo.alertTitle",
              body: "stopLights.ruleTwo.body",
            }),
          ]}
          onCancel={onCancel}
          onAcknowledge={onAcknowledge}
        />
      )

      expect(
        screen.getByRole("heading", { level: 1, name: "Rule one modal title" })
      ).toBeInTheDocument()
      expect(screen.queryByText("Rule two modal title")).not.toBeInTheDocument()

      expect(document.querySelectorAll(".seeds-message")).toHaveLength(1)
      expect(screen.getByText("Rule one alert title")).toBeInTheDocument()
      expect(screen.getByText("Rule one body")).toBeInTheDocument()
      expect(screen.queryByText("Rule two alert title")).not.toBeInTheDocument()
      expect(screen.queryByText("Rule two body")).not.toBeInTheDocument()
      expect(screen.getAllByRole("button", { name: "I understand — continue" })).toHaveLength(1)
    })
  })
})
