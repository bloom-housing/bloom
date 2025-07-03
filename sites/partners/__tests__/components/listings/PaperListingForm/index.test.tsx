import React from "react"
import { act, fireEvent, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { setupServer } from "msw/lib/node"
import { mockNextRouter, render } from "../../../testUtils"
import { rest } from "msw"
import ListingForm from "../../../../src/components/listings/PaperListingForm"
import { AuthContext } from "@bloom-housing/shared-helpers"
import { FeatureFlagEnum } from "@bloom-housing/shared-helpers/src/types/backend-swagger"

const server = setupServer()

beforeAll(() => {
  server.listen()
  mockNextRouter()

  // Mocking issue: https://github.com/ueberdosis/tiptap/discussions/4008#discussioncomment-7623655
  function getBoundingClientRect(): DOMRect {
    const rec = {
      x: 0,
      y: 0,
      bottom: 0,
      height: 0,
      left: 0,
      right: 0,
      top: 0,
      width: 0,
    }
    return { ...rec, toJSON: () => rec }
  }

  class FakeDOMRectList extends Array<DOMRect> implements DOMRectList {
    item(index: number): DOMRect | null {
      return this[index]
    }
  }

  document.elementFromPoint = (): null => null
  HTMLElement.prototype.getBoundingClientRect = getBoundingClientRect
  HTMLElement.prototype.getClientRects = (): DOMRectList => new FakeDOMRectList()
  Range.prototype.getBoundingClientRect = getBoundingClientRect
  Range.prototype.getClientRects = (): DOMRectList => new FakeDOMRectList()
})

afterEach(() => {
  server.resetHandlers()
  window.sessionStorage.clear()
})

afterAll(() => server.close())

describe("add listing", () => {
  it("should render the add listing page", () => {
    window.URL.createObjectURL = jest.fn()
    document.cookie = "access-token-available=True"
    server.use(
      rest.get("http://localhost/api/adapter/user", (_req, res, ctx) => {
        return res(
          ctx.json({ id: "user1", userRoles: { id: "user1", isAdmin: true, isPartner: false } })
        )
      }),
      rest.get("http://localhost:3100/reservedCommunityTypes", (_req, res, ctx) => {
        return res(ctx.json([]))
      }),
      rest.get("http://localhost:3100/multiselectQuestions", (_req, res, ctx) => {
        return res(ctx.json([]))
      })
    )
    render(
      <AuthContext.Provider
        value={{
          doJurisdictionsHaveFeatureFlagOn: (featureFlag: FeatureFlagEnum) => {
            switch (featureFlag) {
              case FeatureFlagEnum.swapCommunityTypeWithPrograms:
                return false
              default:
                return false
            }
          },
        }}
      >
        <ListingForm />
      </AuthContext.Provider>
    )

    // Listing Details Tab
    expect(screen.getByRole("button", { name: "Listing Details" }))
    expect(screen.getByRole("heading", { level: 2, name: "Listing Intro" }))
    expect(screen.getByRole("heading", { level: 2, name: "Listing Photo" }))
    expect(screen.getByRole("heading", { level: 2, name: "Building Details" }))
    expect(screen.getByRole("heading", { level: 2, name: "Listing Units" }))
    expect(screen.getByRole("heading", { level: 2, name: "Housing Preferences" }))
    expect(screen.getByRole("heading", { level: 2, name: "Housing Programs" }))
    expect(screen.getByRole("heading", { level: 2, name: "Additional Fees" }))
    expect(screen.getByRole("heading", { level: 2, name: "Building Features" }))
    expect(screen.getByRole("heading", { level: 2, name: "Additional Eligibility Rules" }))
    expect(screen.getByRole("heading", { level: 2, name: "Additional Details" }))

    // Application Process tab
    expect(screen.getByRole("button", { name: "Application Process" }))
    expect(screen.getByRole("heading", { level: 2, name: "Rankings & Results" }))
    expect(screen.getByRole("heading", { level: 2, name: "Leasing Agent" }))
    expect(screen.getByRole("heading", { level: 2, name: "Application Types" }))
    expect(screen.getByRole("heading", { level: 2, name: "Application Address" }))
    expect(screen.getByRole("heading", { level: 2, name: "Application Dates" }))

    // Action buttons
    expect(screen.getByRole("button", { name: "Publish" }))
    expect(screen.getByRole("button", { name: "Save as Draft" }))
    expect(screen.getByRole("button", { name: "Exit" }))
  })

  it("should render rich text field", async () => {
    window.URL.createObjectURL = jest.fn()
    document.cookie = "access-token-available=True"
    server.use(
      rest.get("http://localhost/api/adapter/user", (_req, res, ctx) => {
        return res(
          ctx.json({ id: "user1", userRoles: { id: "user1", isAdmin: true, isPartner: false } })
        )
      }),
      rest.get("http://localhost:3100/reservedCommunityTypes", (_req, res, ctx) => {
        return res(ctx.json([]))
      }),
      rest.get("http://localhost:3100/multiselectQuestions", (_req, res, ctx) => {
        return res(ctx.json([]))
      })
    )
    render(
      <AuthContext.Provider
        value={{
          doJurisdictionsHaveFeatureFlagOn: (featureFlag: FeatureFlagEnum) => {
            switch (featureFlag) {
              case FeatureFlagEnum.swapCommunityTypeWithPrograms:
                return false
              default:
                return false
            }
          },
        }}
      >
        <ListingForm />
      </AuthContext.Provider>
    )
    expect(screen.getByText("Rankings & Results")).toBeInTheDocument()
    await userEvent.type(screen.getByTestId("whatToExpect"), "Custom what to expect text")
    expect(
      screen.getByText(
        "Applicants will be contacted by the property agent in rank order until vacancies are filled. All of the information that you have provided will be verified and your eligibility confirmed. Your application will be removed from the waitlist if you have made any fraudulent statements. If we cannot verify a housing preference that you have claimed, you will not receive the preference but will not be otherwise penalized. Should your application be chosen, be prepared to fill out a more detailed application and provide required supporting documents."
      )
    ).toBeInTheDocument()
    expect(screen.getByText("549 / 4000 characters")).toBeInTheDocument()
    expect(screen.getByLabelText("Bold")).toBeInTheDocument()
    expect(screen.getByLabelText("Bullet list")).toBeInTheDocument()
    expect(screen.getByLabelText("Numbered list")).toBeInTheDocument()
    expect(screen.getByLabelText("Line break")).toBeInTheDocument()
    expect(screen.getByLabelText("Set link")).toBeInTheDocument()
    expect(screen.getByLabelText("Unlink")).toBeInTheDocument()
    // Query issue: https://github.com/ueberdosis/tiptap/discussions/4008#discussioncomment-7623655
    const editor = screen.getByTestId("whatToExpect").firstElementChild.querySelector("p")
    act(() => {
      fireEvent.change(editor, {
        target: { textContent: "Custom what to expect text" },
      })
    })
    expect(screen.getByText("Custom what to expect text")).toBeInTheDocument()
  })

  it.todo("should successfully save and show correct toast")
  it.todo("should open the save before exit dialog when exiting")
  it.todo("should open the close listing dialog when closing listing")
  it.todo("should open the publish listing dialog when publishing listing")
  it.todo("should open the live confirmation dialog when listing is already active")
  it.todo("should open the listing approval dialog when submitting for approval")
  it.todo("should open the request changes dialog when requesting changes")
})
