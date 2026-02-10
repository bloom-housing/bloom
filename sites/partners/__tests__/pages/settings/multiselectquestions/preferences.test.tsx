import React from "react"
import { MessageContext, MessageProvider } from "@bloom-housing/shared-helpers"
import {
  listing,
  multiselectQuestionPreferenceV2,
} from "@bloom-housing/shared-helpers/__tests__/testHelpers"
import {
  FeatureFlagEnum,
  MultiselectQuestionsStatusEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { Toast } from "@bloom-housing/ui-seeds"
import { fireEvent, waitFor, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { rest } from "msw"
import { setupServer } from "msw/lib/node"
import MultiselectQuestionsPreferences from "../../../../src/pages/settings/multiselectquestions/preferences"
import { mockNextRouter, render } from "../../../testUtils"

const server = setupServer()

beforeAll(() => {
  server.listen()
  mockNextRouter()
})

beforeEach(() => {
  server.use(
    rest.get("http://localhost/api/adapter/mapLayers", (_req, res, ctx) => {
      return res(ctx.json([]))
    }),
    rest.get("http://localhost:3100/mapLayers", (_req, res, ctx) => {
      return res(ctx.json([]))
    }),
    rest.get("http://localhost:3100/multiselectQuestions", (_req, res, ctx) => {
      return res(ctx.json({ items: [multiselectQuestionPreferenceV2] }))
    }),
    rest.get("http://localhost/api/adapter/multiselectQuestions", (_req, res, ctx) => {
      return res(ctx.json({ items: [multiselectQuestionPreferenceV2] }))
    }),
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
                { name: FeatureFlagEnum.enableV2MSQ, active: true },
              ],
            },
          ],
        })
      )
    })
  )
})

afterEach(() => server.resetHandlers())

afterAll(() => server.close())

const ToastProvider = (props: any) => {
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

describe("settings", () => {
  describe("preference table", () => {
    it("should render the preference table", async () => {
      window.URL.createObjectURL = jest.fn()
      document.cookie = "access-token-available=True"
      server.use(
        rest.get(
          "http://localhost/api/adapter/multiselectQuestions/listings/id1",
          (_req, res, ctx) => {
            return res(ctx.json([listing]))
          }
        )
      )
      const { getByText, findByText, findByRole } = render(<MultiselectQuestionsPreferences />)

      expect(getByText("Preferences")).toBeInTheDocument()

      await findByText("Status")
      await findByText("Last updated")
      const table = await findByRole("grid")
      const rowgroup = within(table).getAllByRole("rowgroup")
      const head = rowgroup[0]
      const rows = rowgroup[1].children
      expect(rows).toHaveLength(1)
      expect(within(head).getAllByRole("columnheader")).toHaveLength(5)
      const [name, status, jurisdiction, updated, actions] = within(
        rows[0] as HTMLElement
      ).getAllByRole("gridcell")
      expect(name).toHaveTextContent(multiselectQuestionPreferenceV2.name)
      await within(status).findByText("Visible")
      expect(jurisdiction).toHaveTextContent("Bloomington")
      expect(updated).toHaveTextContent("09/15/2022")
      await within(actions).findByText("Edit")
    })
  })

  describe("deletion", () => {
    it("should delete a preference", async () => {
      const user = userEvent.setup()
      window.URL.createObjectURL = jest.fn()
      document.cookie = "access-token-available=True"
      server.use(
        rest.delete("http://localhost/api/adapter/multiselectQuestions", (_req, res, ctx) => {
          return res(ctx.json({}))
        })
      )

      const { findByText, findByRole, queryAllByText } = render(
        <ToastProvider>
          <MultiselectQuestionsPreferences />
        </ToastProvider>
      )

      await user.click(await findByText("Edit"))
      await user.click(await findByText("Delete"))

      // verify modal has all of the correct fields
      const modal = await findByRole("dialog", { name: "Are you sure?" })
      expect(within(modal).getByText("Are you sure?")).toBeInTheDocument()
      expect(within(modal).getByText("Deleting a preference cannot be undone."))
      expect(within(modal).getByText("Delete")).toBeInTheDocument()
      expect(within(modal).getByText("Cancel")).toBeInTheDocument()

      // Press the delete button
      await user.click(within(modal).getByText("Delete"))

      // Modal should be closed and the alert popped up
      const removedToaster = await findByText("Preference removed")
      expect(removedToaster).toBeInTheDocument()
      expect(queryAllByText("Are you sure?")).toHaveLength(0)
    })
  })

  describe("creating preferences", () => {
    it("should allow a preference and option to be saved", async () => {
      const user = userEvent.setup()
      window.URL.createObjectURL = jest.fn()
      document.cookie = "access-token-available=True"
      const requestSpy = jest.fn()
      server.use(
        rest.get("http://localhost/api/adapter/user", (_req, res, ctx) => {
          return res(
            ctx.json({
              id: "user1",
              roles: { id: "user1", isAdmin: true, isPartner: false },
              jurisdictions: [{ id: "id1", name: "Housing Jurisdiction" }],
            })
          )
        }),
        rest.get(
          "http://localhost/api/adapter/multiselectQuestions/listings/id1",
          (_req, res, ctx) => {
            return res(ctx.json([listing]))
          }
        ),
        rest.post("http://localhost/api/adapter/multiselectQuestions", async (req, res, ctx) => {
          requestSpy(await req.json())
          return res(ctx.json({}))
        })
      )

      const {
        findByText,
        getByTestId,
        getByText,
        getAllByText,
        getByLabelText,
        getAllByLabelText,
      } = render(
        <ToastProvider>
          <MultiselectQuestionsPreferences />
        </ToastProvider>
      )

      await findByText(`${multiselectQuestionPreferenceV2.name}`)

      // Add a preference
      fireEvent.click(getByText("Add preference"))
      fireEvent.change(getByLabelText("Title"), { target: { value: "New Preference Item" } })
      fireEvent.change(getByLabelText("Description"), {
        target: { value: "Preference Description" },
      })

      // Add a preference option
      fireEvent.click(getByText("Add option"))
      fireEvent.change(getAllByLabelText("Title")[1], { target: { value: "New Option Item" } })
      fireEvent.change(getAllByLabelText("Description")[1], {
        target: { value: "Option Description" },
      })
      fireEvent.click(getByTestId("collect-address-no"))
      await user.click(getAllByText("Save")[1])

      // Check validation
      await user.click(getByText("Save"))
      expect(getAllByText("This field is required")).toHaveLength(1)

      await user.selectOptions(getByLabelText("Jurisdiction"), "Housing Jurisdiction")

      await user.click(getByText("Save"))
      await findByText("Preference created") // Check toast notification

      // Verify the call to save the new preference
      await waitFor(() => {
        expect(requestSpy).toHaveBeenCalledWith({
          applicationSection: "preferences",
          description: "Preference Description",
          hideFromListing: true,
          jurisdictions: [],
          jurisdiction: { id: "id1", name: "Housing Jurisdiction" },
          links: [],
          isExclusive: false,
          multiselectOptions: [
            {
              name: "New Option Item",
              description: "Option Description",
              links: [],
              ordinal: 1,
              shouldCollectAddress: false,
              isOptOut: false,
              text: "",
            },
          ],
          status: "draft",
          name: "New Preference Item",
          text: "",
        })
      })
    })
  })
  describe("viewing preferences", () => {
    it("should let you view a preference for active status", async () => {
      const user = userEvent.setup()
      window.URL.createObjectURL = jest.fn()
      document.cookie = "access-token-available=True"
      server.use(
        rest.get("http://localhost/api/adapter/multiselectQuestions", (_req, res, ctx) => {
          return res(
            ctx.json({
              items: [
                {
                  ...multiselectQuestionPreferenceV2,
                  jurisdiction: { id: "jurisdiction1", name: "jurisdictionWithJurisdictionAdmin" },
                  status: MultiselectQuestionsStatusEnum.active,
                },
              ],
            })
          )
        })
      )

      const { findByText, findByRole, findAllByRole } = render(
        <ToastProvider>
          <MultiselectQuestionsPreferences />
        </ToastProvider>
      )

      await user.click(await findByText("View"))
      const drawer = await findByRole("dialog")
      within(drawer).getByText("View preference")
      within(drawer).getByText("Live/Work in County")
      within(drawer).getByText("At least one household member lives or works in County")
      within(drawer).getByText("https://www.example.com")
      within(drawer).getByText("Live/Work in County Link Title")
      within(drawer).getByText("jurisdictionWithJurisdictionAdmin")

      // test option drawer
      await user.click(within(drawer).getAllByText("View")[0])
      const nestedDrawer = (await findAllByRole("dialog"))[1]
      within(nestedDrawer).getByText("Live in County")
      within(nestedDrawer).getByText("A description of the option.")
      within(nestedDrawer).getByText("https://www.example.com")
      within(nestedDrawer).getByText("Live in County Link Title")
      expect(within(nestedDrawer).getAllByText("No")).toHaveLength(2)
    })
  })
})
