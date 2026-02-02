import React from "react"
import { setupServer } from "msw/lib/node"
import { fireEvent, screen, within } from "@testing-library/react"
import { rest } from "msw"
import { MessageContext, MessageProvider } from "@bloom-housing/shared-helpers"
import { Toast } from "@bloom-housing/ui-seeds"
import {
  listing,
  multiselectQuestionPreference,
} from "@bloom-housing/shared-helpers/__tests__/testHelpers"
import { FeatureFlagEnum } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { mockNextRouter, render } from "../../testUtils"
import SettingsPreferences from "../../../src/pages/settings/preferences"

const server = setupServer()

beforeAll(() => {
  server.listen()
  mockNextRouter()
})

beforeEach(() => {
  server.use(
    rest.get("http://localhost/api/adapter/mapLayers", (_req, res, ctx) => {
      return res(ctx.json({}))
    }),
    rest.get("http://localhost:3100/mapLayers", (_req, res, ctx) => {
      return res(ctx.json({}))
    })
  )
})

afterEach(() => server.resetHandlers())

afterAll(() => server.close())

describe("settings", () => {
  describe("preference table", () => {
    it("should render `none` when no preferences exist", async () => {
      server.use(
        rest.get("http://localhost:3100/multiselectQuestions", (_req, res, ctx) => {
          return res(
            ctx.json({
              items: [],
              meta: { totalItems: 0, totalPages: 0 },
            })
          )
        }),
        rest.get("http://localhost:3100/multiselectQuestions", (_req, res, ctx) => {
          return res(
            ctx.json({
              items: [],
              meta: { totalItems: 0, totalPages: 0 },
            })
          )
        }),
        rest.get(
          "http://localhost/api/adapter/multiselectQuestions/listings/id1",
          (_req, res, ctx) => {
            return res(ctx.json([listing]))
          }
        )
      )

      const { getByText, findByText } = render(<SettingsPreferences />)

      expect(getByText("Settings")).toBeInTheDocument()
      expect(getByText("Preferences")).toBeInTheDocument()

      await findByText("None")
      expect(getByText("None")).toBeInTheDocument()
    })

    it("should render tabs if multiple settings are on", async () => {
      window.URL.createObjectURL = jest.fn()
      document.cookie = "access-token-available=True"
      server.use(
        rest.get("http://localhost:3100/multiselectQuestions", (_req, res, ctx) => {
          return res(
            ctx.json({
              items: [multiselectQuestionPreference],
              meta: { totalItems: 1, totalPages: 1 },
            })
          )
        }),
        rest.get("http://localhost/api/adapter/multiselectQuestions", (_req, res, ctx) => {
          return res(
            ctx.json({
              items: [multiselectQuestionPreference],
              meta: { totalItems: 1, totalPages: 1 },
            })
          )
        }),
        rest.get(
          "http://localhost/api/adapter/multiselectQuestions/listings/id1",
          (_req, res, ctx) => {
            return res(ctx.json([listing]))
          }
        ),
        rest.get("http://localhost/api/adapter/user", (_req, res, ctx) => {
          return res(
            ctx.json({
              id: "user1",
              roles: { id: "user1", isAdmin: false, isPartner: true },
              jurisdictions: [
                {
                  id: "jurisdiction1",
                  name: "jurisdictionWithJurisdictionAdmin",
                  featureFlags: [{ name: FeatureFlagEnum.enableProperties, active: true }],
                },
                {
                  id: "jurisdiction2",
                  name: "jurisdictionWithJurisdictionAdmin2",
                  featureFlags: [],
                },
              ],
            })
          )
        })
      )

      render(<SettingsPreferences />)
      expect(screen.getByText("Settings")).toBeInTheDocument()
      expect(await screen.findByRole("tablist")).toBeInTheDocument()
      expect(screen.getByRole("heading", { level: 2, name: "Preferences" })).toBeInTheDocument()
      expect(screen.getByText("Properties")).toBeInTheDocument()
    })

    it("should not render tabs if only preferences is on", async () => {
      window.URL.createObjectURL = jest.fn()
      document.cookie = "access-token-available=True"
      server.use(
        rest.get("http://localhost:3100/multiselectQuestions", (_req, res, ctx) => {
          return res(
            ctx.json({
              items: [multiselectQuestionPreference],
              meta: { totalItems: 1, totalPages: 1 },
            })
          )
        }),
        rest.get("http://localhost/api/adapter/multiselectQuestions", (_req, res, ctx) => {
          return res(
            ctx.json({
              items: [multiselectQuestionPreference],
              meta: { totalItems: 1, totalPages: 1 },
            })
          )
        }),
        rest.get(
          "http://localhost/api/adapter/multiselectQuestions/listings/id1",
          (_req, res, ctx) => {
            return res(ctx.json([listing]))
          }
        ),
        rest.get("http://localhost/api/adapter/user", (_req, res, ctx) => {
          return res(
            ctx.json({
              id: "user1",
              roles: { id: "user1", isAdmin: false, isPartner: true },
              jurisdictions: [
                {
                  id: "jurisdiction1",
                  name: "jurisdictionWithJurisdictionAdmin",
                  featureFlags: [
                    { name: FeatureFlagEnum.enableProperties, active: false },
                    { name: FeatureFlagEnum.disableListingPreferences, active: false },
                  ],
                },
              ],
            })
          )
        })
      )

      render(<SettingsPreferences />)
      expect(await screen.findByText("Settings")).toBeInTheDocument()
      expect(
        await screen.findByRole("heading", { level: 2, name: "Preferences" })
      ).toBeInTheDocument()
      expect(screen.queryByRole("tablist")).not.toBeInTheDocument()
      expect(screen.queryByText("Properties")).not.toBeInTheDocument()
    })

    it("should render the preference table", async () => {
      window.URL.createObjectURL = jest.fn()
      document.cookie = "access-token-available=True"
      server.use(
        rest.get("http://localhost:3100/multiselectQuestions", (_req, res, ctx) => {
          return res(
            ctx.json({
              items: [multiselectQuestionPreference],
              meta: { totalItems: 1, totalPages: 1 },
            })
          )
        }),
        rest.get("http://localhost/api/adapter/multiselectQuestions", (_req, res, ctx) => {
          return res(
            ctx.json({
              items: [multiselectQuestionPreference],
              meta: { totalItems: 1, totalPages: 1 },
            })
          )
        }),
        rest.get(
          "http://localhost/api/adapter/multiselectQuestions/listings/id1",
          (_req, res, ctx) => {
            return res(ctx.json([listing]))
          }
        ),
        rest.get("http://localhost/api/adapter/user", (_req, res, ctx) => {
          return res(
            ctx.json({
              id: "user1",
              roles: { id: "user1", isAdmin: false, isPartner: true },
              jurisdictions: [
                {
                  id: "jurisdiction1",
                  name: "jurisdictionWithJurisdictionAdmin",
                  featureFlags: [
                    { name: FeatureFlagEnum.enableProperties, active: false },
                    { name: FeatureFlagEnum.disableListingPreferences, active: false },
                  ],
                },
              ],
            })
          )
        })
      )
      const { getByText, findByText, findByRole } = render(<SettingsPreferences />)

      expect(getByText("Settings")).toBeInTheDocument()
      expect(getByText("Preferences")).toBeInTheDocument()

      await findByText("Name")
      const table = await findByRole("table")
      const headAndBody = within(table).getAllByRole("rowgroup")
      expect(headAndBody).toHaveLength(2)
      const [head, body] = headAndBody
      expect(within(head).getAllByRole("columnheader")).toHaveLength(4)
      const rows = await within(body).findAllByRole("row")
      expect(rows).toHaveLength(1)
      const [name, jurisdiction, updated, actions] = within(rows[0]).getAllByRole("cell")
      expect(name).toHaveTextContent(multiselectQuestionPreference.text)
      expect(jurisdiction).toHaveTextContent("Bloomington")
      expect(updated).toHaveTextContent("09/15/2022")
      const actionButtons = within(actions).getAllByRole("button")
      expect(actionButtons).toHaveLength(3)
    })
  })

  describe("deletion", () => {
    it("should delete a preference", async () => {
      window.URL.createObjectURL = jest.fn()
      document.cookie = "access-token-available=True"
      server.use(
        rest.get("http://localhost/api/adapter/user", (_req, res, ctx) => {
          return res(
            ctx.json({
              id: "user1",
              roles: { id: "user1", isAdmin: true, isPartner: false },
              jurisdictions: [{ id: "id1" }],
            })
          )
        }),
        rest.get(
          "http://localhost/api/adapter/listings/byMultiselectQuestion/id1",
          (_req, res, ctx) => {
            return res(ctx.json([]))
          }
        ),
        rest.get("http://localhost:3100/multiselectQuestions", (_req, res, ctx) => {
          return res(
            ctx.json({
              items: [multiselectQuestionPreference],
              meta: { totalItems: 1, totalPages: 1 },
            })
          )
        }),
        rest.get("http://localhost/api/adapter/multiselectQuestions", (_req, res, ctx) => {
          return res(
            ctx.json({
              items: [multiselectQuestionPreference],
              meta: { totalItems: 1, totalPages: 1 },
            })
          )
        }),
        rest.delete("http://localhost/api/adapter/multiselectQuestions", (_req, res, ctx) => {
          return res(ctx.json({}))
        })
      )

      const ToastProvider = (props) => {
        const { toastMessagesRef } = React.useContext(MessageContext)
        return (
          <MessageProvider>
            {toastMessagesRef.current?.map((toastMessage) => (
              <Toast {...toastMessage.props} testId="toast-alert" key={toastMessage.timestamp}>
                {toastMessage.message}
              </Toast>
            ))}
            {props.children}
          </MessageProvider>
        )
      }

      const { findByText, getByTestId, findByRole, queryAllByText } = render(
        <ToastProvider>
          <SettingsPreferences />
        </ToastProvider>
      )

      await findByText(multiselectQuestionPreference.text)

      fireEvent.click(getByTestId(`preference-delete-icon: ${multiselectQuestionPreference.text}`))

      // verify modal has all of the correct fields
      const modal = await findByRole("dialog", { name: "Are you sure?" })
      expect(within(modal).getByText("Are you sure?")).toBeInTheDocument()
      expect(within(modal).getByText("Deleting a preference cannot be undone."))
      expect(within(modal).getByText("Delete")).toBeInTheDocument()
      expect(within(modal).getByText("Cancel")).toBeInTheDocument()

      // Press the delete button
      fireEvent.click(within(modal).getByText("Delete"))

      // Modal should be closed and the alert popped up
      const removedToaster = await findByText("Preference removed")
      expect(removedToaster).toBeInTheDocument()
      expect(queryAllByText("Are you sure?")).toHaveLength(0)
    })

    it("should not allow a preference to be deleted when listing is tied to it", async () => {
      window.URL.createObjectURL = jest.fn()
      document.cookie = "access-token-available=True"
      server.use(
        rest.get("http://localhost/api/adapter/user", (_req, res, ctx) => {
          return res(
            ctx.json({
              id: "user1",
              roles: { id: "user1", isAdmin: true, isPartner: false },
              jurisdictions: [{ id: "id1" }],
            })
          )
        }),
        rest.get("http://localhost:3100/multiselectQuestions", (_req, res, ctx) => {
          return res(
            ctx.json({
              items: [multiselectQuestionPreference],
              meta: { totalItems: 1, totalPages: 1 },
            })
          )
        }),
        rest.get("http://localhost/api/adapter/multiselectQuestions", (_req, res, ctx) => {
          return res(
            ctx.json({
              items: [multiselectQuestionPreference],
              meta: { totalItems: 1, totalPages: 1 },
            })
          )
        }),
        rest.get(
          "http://localhost/api/adapter/listings/byMultiselectQuestion/id1",
          (_req, res, ctx) => {
            return res(ctx.json([listing]))
          }
        )
      )

      const { findByText, getByTestId, findByRole, queryAllByText, getByText } = render(
        <SettingsPreferences />
      )

      await findByText(multiselectQuestionPreference.text)

      fireEvent.click(getByTestId(`preference-delete-icon: ${multiselectQuestionPreference.text}`))

      // verify modal is open with applicable text
      await findByRole("dialog", { name: "Changes required before deleting" })
      expect(
        getByText(
          `This preference is currently added to listings and needs to be removed before being deleted.`
        )
      )
      expect(await findByText(listing.name))
      // verify delete button is not there
      expect(queryAllByText("Delete")).toHaveLength(0)

      // close modal
      fireEvent.click(getByText("Done"))
      expect(queryAllByText("Changes required before deleting")).toHaveLength(0)
    })
  })
  describe("creating preferences", () => {
    it("should not show geocoding functionality if not enabled", async () => {
      window.URL.createObjectURL = jest.fn()
      document.cookie = "access-token-available=True"
      server.use(
        rest.get("http://localhost/api/adapter/user", (_req, res, ctx) => {
          return res(
            ctx.json({
              id: "user1",
              roles: { id: "user1", isAdmin: true, isPartner: false },
              jurisdictions: [{ id: "id1" }],
            })
          )
        }),
        rest.get("http://localhost:3100/multiselectQuestions", (_req, res, ctx) => {
          return res(
            ctx.json({
              items: [multiselectQuestionPreference],
              meta: { totalItems: 1, totalPages: 1 },
            })
          )
        }),
        rest.get("http://localhost/api/adapter/multiselectQuestions", (_req, res, ctx) => {
          return res(
            ctx.json({
              items: [multiselectQuestionPreference],
              meta: { totalItems: 1, totalPages: 1 },
            })
          )
        }),
        rest.get(
          "http://localhost/api/adapter/multiselectQuestions/listings/id1",
          (_req, res, ctx) => {
            return res(ctx.json([listing]))
          }
        )
      )

      const { findByText, getByTestId, queryAllByText, getByText } = render(<SettingsPreferences />)

      await findByText(multiselectQuestionPreference.text)

      // Add a preference
      fireEvent.click(getByText("Add item"))
      expect(getByText("Add preference")).toBeInTheDocument()

      // Add a preference option
      fireEvent.click(getByText("Add option"))
      expect(getByText("Do you want to collect address information?")).toBeInTheDocument()

      // Click collect address
      fireEvent.click(getByTestId("collect-address-yes"))
      expect(queryAllByText("Do you need help validating the address?")).toHaveLength(0)
    })

    it("should show geocoding functionality if enabled", async () => {
      document.cookie = "access-token-available=True"
      server.use(
        rest.get("http://localhost:3100/multiselectQuestions", (_req, res, ctx) => {
          return res(
            ctx.json({
              items: [multiselectQuestionPreference],
              meta: { totalItems: 1, totalPages: 1 },
            })
          )
        }),
        rest.get("http://localhost/api/adapter/multiselectQuestions", (_req, res, ctx) => {
          return res(
            ctx.json({
              items: [multiselectQuestionPreference],
              meta: { totalItems: 1, totalPages: 1 },
            })
          )
        }),
        rest.get(
          "http://localhost/api/adapter/multiselectQuestions/listings/id1",
          (_req, res, ctx) => {
            return res(ctx.json([listing]))
          }
        ),
        rest.get("http://localhost/api/adapter/user", (_req, res, ctx) => {
          return res(
            ctx.json({
              id: "user1",
              roles: { id: "user1", isAdmin: false, isPartner: true },
              jurisdictions: [
                { id: "jurisdiction1", enableGeocodingPreferences: true, name: "jurisdiction 1" },
              ],
            })
          )
        })
      )

      const { findByText, getByTestId, queryAllByText, getByText } = render(<SettingsPreferences />)

      await findByText(multiselectQuestionPreference.text)

      // Add a preference
      fireEvent.click(getByText("Add item"))
      expect(getByText("Add preference")).toBeInTheDocument()

      // Add a preference option
      fireEvent.click(getByText("Add option"))
      expect(getByText("Do you want to collect address information?")).toBeInTheDocument()

      // Click collect address
      fireEvent.click(getByTestId("collect-address-yes"))
      expect(queryAllByText("Do you need help validating the address?")).toHaveLength(1)
    })
  })
})
