import React from "react"
import { setupServer } from "msw/lib/node"
import { fireEvent, within } from "@testing-library/react"
import Settings from "../../../src/pages/settings"
import { rest } from "msw"
import {
  listing,
  multiselectQuestionPreference,
} from "@bloom-housing/shared-helpers/__tests__/testHelpers"
import { mockNextRouter, render } from "../../testUtils"

const server = setupServer()

beforeAll(() => {
  server.listen()
  mockNextRouter()
})

afterEach(() => server.resetHandlers())

afterAll(() => server.close())

describe("settings", () => {
  it("should render `none` when no preferences exist", async () => {
    server.use(
      rest.get("http://localhost:3100/multiselectQuestions", (_req, res, ctx) => {
        return res(ctx.json([]))
      }),
      rest.get("http://localhost/api/adapter/multiselectQuestions", (_req, res, ctx) => {
        return res(ctx.json([multiselectQuestionPreference]))
      })
    )

    const { getByText, findByText } = render(<Settings />)

    expect(getByText("Settings")).toBeInTheDocument()
    expect(getByText("Preferences")).toBeInTheDocument()

    await findByText("None")
    expect(getByText("None")).toBeInTheDocument()
  })

  it("should render the preference table", async () => {
    server.use(
      rest.get("http://localhost:3100/multiselectQuestions", (_req, res, ctx) => {
        return res(ctx.json([multiselectQuestionPreference]))
      }),
      rest.get("http://localhost/api/adapter/multiselectQuestions", (_req, res, ctx) => {
        return res(ctx.json([multiselectQuestionPreference]))
      })
    )
    const { getByText, findByText, getByRole } = render(<Settings key="1" />)

    expect(getByText("Settings")).toBeInTheDocument()
    expect(getByText("Preferences")).toBeInTheDocument()

    await findByText("Name")
    const table = getByRole("table")
    const headAndBody = within(table).getAllByRole("rowgroup")
    expect(headAndBody).toHaveLength(2)
    const [head, body] = headAndBody
    expect(within(head).getAllByRole("columnheader")).toHaveLength(4)
    const rows = within(body).getAllByRole("row")
    expect(rows).toHaveLength(1)
    const [name, jurisdiction, updated, actions] = within(rows[0]).getAllByRole("cell")
    expect(name).toHaveTextContent(multiselectQuestionPreference.text)
    expect(jurisdiction).toHaveTextContent("Alameda")
    expect(updated).toHaveTextContent("09/15/2022")
    const actionButtons = within(actions).getAllByRole("button")
    expect(actionButtons).toHaveLength(3)
  })

  it("should delete a preference", async () => {
    server.use(
      rest.get("http://localhost:3100/multiselectQuestions", (_req, res, ctx) => {
        return res(ctx.json([multiselectQuestionPreference]))
      }),
      rest.get("http://localhost/api/adapter/multiselectQuestions", (_req, res, ctx) => {
        return res(ctx.json([multiselectQuestionPreference]))
      }),
      rest.get(
        "http://localhost/api/adapter/multiselectQuestions/listings/id1",
        (_req, res, ctx) => {
          return res(ctx.json([]))
        }
      ),
      rest.delete("http://localhost/api/adapter/multiselectQuestions", (_req, res, ctx) => {
        return res(ctx.json({}))
      }),
      rest.options("http://localhost/api/adapter/multiselectQuestions", (_req, res, ctx) => {
        return res(ctx.json({}))
      })
    )
    const { findByText, getByTestId, findByRole, queryAllByText } = render(<Settings key={"2"} />)

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
    const removedToaster = await findByText("Preference Removed")
    expect(removedToaster).toBeInTheDocument()
    expect(queryAllByText("Are you sure?")).toHaveLength(0)
  })

  it("should not allow a preference to be deleted when listing is tied to it", async () => {
    server.use(
      rest.get("http://localhost:3100/multiselectQuestions", (_req, res, ctx) => {
        return res(ctx.json([multiselectQuestionPreference]))
      }),
      rest.get("http://localhost/api/adapter/multiselectQuestions", (_req, res, ctx) => {
        return res(ctx.json([multiselectQuestionPreference]))
      }),
      rest.get(
        "http://localhost/api/adapter/multiselectQuestions/listings/id1",
        (_req, res, ctx) => {
          return res(ctx.json([listing]))
        }
      )
    )

    const { findByText, getByTestId, findByRole, queryAllByText, getByText } = render(<Settings />)

    await findByText(multiselectQuestionPreference.text)

    fireEvent.click(getByTestId(`preference-delete-icon: ${multiselectQuestionPreference.text}`))

    // verify modal is open with applicable text
    await findByRole("dialog", { name: "Changes required before deleting" })
    expect(
      getByText(
        `This preference is currently added to listings and needs to be removed before being deleted.`
      )
    )
    expect(getByText(listing.name))
    // verify delete button is not there
    expect(queryAllByText("Delete")).toHaveLength(0)

    // close modal
    fireEvent.click(getByText("Done"))
    expect(queryAllByText("Changes required before deleting")).toHaveLength(0)
  })
})
