import React from "react"
import { setupServer } from "msw/lib/node"
import { fireEvent, waitFor } from "@testing-library/react"
import { AuthContext, blankApplication } from "@bloom-housing/shared-helpers"
import { Listing } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { mockNextRouter, render } from "../../../testUtils"
import ApplicationTerms from "../../../../src/pages/applications/review/terms"
import ApplicationConductor from "../../../../src/lib/applications/ApplicationConductor"
import { AppSubmissionContext } from "../../../../src/lib/applications/AppSubmissionContext"
import {
  StopLightRule,
  stopLightRules,
} from "../../../../src/lib/applications/stopLights/stopLightRules"

window.scrollTo = jest.fn()

const server = setupServer()

beforeAll(() => {
  server.listen()
  mockNextRouter()
})

afterEach(() => server.resetHandlers())

afterAll(() => server.close())

describe("applications pages", () => {
  afterAll(() => {
    jest.clearAllMocks()
  })

  describe("terms step", () => {
    it("should render form fields", () => {
      const { getByText, getByTestId } = render(<ApplicationTerms />)

      expect(getByText("Terms")).toBeInTheDocument()
      expect(getByTestId("app-terms-agree")).toBeInTheDocument()
    })

    it("should require form input", async () => {
      const { getByText, findByText } = render(<ApplicationTerms />)

      fireEvent.click(getByText("Submit"))
      expect(
        await findByText("You must agree to the terms in order to continue")
      ).toBeInTheDocument()
    })
  })

  describe("terms step stop-light backstop", () => {
    const registrySnapshot = [...stopLightRules]

    const nameRule = (triggers: boolean): StopLightRule => ({
      key: "nameBlocked",
      step: "primaryApplicantName",
      light: "red",
      evaluate: () => triggers,
      modalTitle: "stopLights.nameBlocked.modalTitle",
      alertTitle: "stopLights.nameBlocked.alertTitle",
      body: "stopLights.nameBlocked.body",
    })

    const renderTerms = (rules: StopLightRule[]) => {
      stopLightRules.splice(0, stopLightRules.length, ...rules)

      const application = JSON.parse(JSON.stringify(blankApplication))
      const conductor = new ApplicationConductor(application, {} as Listing)
      conductor.config = {
        sections: ["you", "household", "income", "preferences", "review"],
        languages: [],
        steps: [{ name: "primaryApplicantName" }, { name: "summary" }, { name: "terms" }],
        featureFlags: [],
        isAdvocate: false,
        enabledStopLightRuleKeys: rules.map((rule) => rule.key),
      }

      const submit = jest.fn().mockResolvedValue({ confirmationCode: "ABC123" })

      const view = render(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        <AuthContext.Provider value={{ applicationsService: { submit } } as any}>
          <AppSubmissionContext.Provider
            value={{
              conductor,
              application: conductor.application,
              listing: conductor.listing,
              syncApplication: () => undefined,
              syncListing: () => undefined,
            }}
          >
            <ApplicationTerms />
          </AppSubmissionContext.Provider>
        </AuthContext.Provider>
      )

      return { ...view, submit, conductor }
    }

    afterEach(() => {
      stopLightRules.splice(0, stopLightRules.length, ...registrySnapshot)
    })

    it("redirects to the blocked step instead of submitting when a red rule triggers", async () => {
      const { pushMock } = mockNextRouter()
      const { getByLabelText, getByText, submit, conductor } = renderTerms([nameRule(true)])

      fireEvent.click(
        getByLabelText("I agree and understand that I cannot change anything after I submit.")
      )
      fireEvent.click(getByText("Submit"))

      await waitFor(() =>
        expect(pushMock).toHaveBeenCalledWith("/applications/contact/name?blockedRule=nameBlocked")
      )
      expect(submit).not.toHaveBeenCalled()
      expect(conductor.application.acceptedTerms).not.toBe(true)
    })

    it("submits normally when no red rule triggers", async () => {
      const { pushMock } = mockNextRouter()
      const { getByLabelText, getByText, submit } = renderTerms([nameRule(false)])

      fireEvent.click(
        getByLabelText("I agree and understand that I cannot change anything after I submit.")
      )
      fireEvent.click(getByText("Submit"))

      await waitFor(() => expect(submit).toHaveBeenCalledTimes(1))
      await waitFor(() =>
        expect(pushMock).toHaveBeenCalledWith("/applications/review/confirmation")
      )
      expect(pushMock).not.toHaveBeenCalledWith(expect.stringContaining("blockedRule"))
    })
  })
})
