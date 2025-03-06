import React from "react"
import { setupServer } from "msw/lib/node"
import { render } from "@testing-library/react"
import { listing } from "@bloom-housing/shared-helpers/__tests__/testHelpers"
import { ListingBrowse } from "../../../src/components/browse/ListingBrowse"
import { mockNextRouter } from "../../testUtils"

const server = setupServer()

beforeAll(() => {
  server.listen()
  mockNextRouter()
})

afterEach(() => server.resetHandlers())

afterAll(() => server.close())

describe("<ListingBrowse>", () => {
  it("shows empty state", () => {
    const view = render(<ListingBrowse openListings={[]} closedListings={[]} />)
    expect(view.getByText("No listings currently have open applications.")).toBeDefined()
  })
  it("shows multiple open listings", () => {
    const view = render(
      <ListingBrowse
        openListings={[
          { ...listing, name: "ListingA" },
          { ...listing, name: "ListingB" },
        ]}
        closedListings={[]}
      />
    )
    expect(view.queryByText("No listings currently have open applications.")).toBeNull()
    expect(view.getByText("ListingA")).toBeDefined()
    expect(view.getByText("ListingB")).toBeDefined()
  })
})
