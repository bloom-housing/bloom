import React from "react"
import { setupServer } from "msw/lib/node"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { listing, jurisdiction } from "@bloom-housing/shared-helpers/__tests__/testHelpers"
import { ListingBrowse, TabsIndexEnum } from "../../../src/components/browse/ListingBrowse"
import { mockNextRouter } from "../../testUtils"

const server = setupServer()

beforeAll(() => {
  server.listen()
  mockNextRouter()
})

afterEach(() => server.resetHandlers())

afterAll(() => server.close())

describe("<ListingBrowse>", () => {
  it("shows empty state, open listings", () => {
    render(<ListingBrowse listings={[]} tab={TabsIndexEnum.open} jurisdiction={jurisdiction} />)
    expect(screen.getByText("No listings currently have open applications.")).toBeDefined()
    expect(screen.queryByRole("button", { name: /previous/i })).not.toBeInTheDocument()
    expect(screen.queryByRole("button", { name: /next/i })).not.toBeInTheDocument()
    expect(screen.queryByText(/page \d* of \d*/i)).not.toBeInTheDocument()
  })

  it("shows empty state, closed listings", () => {
    render(<ListingBrowse listings={[]} tab={TabsIndexEnum.closed} jurisdiction={jurisdiction} />)
    expect(screen.getByText("No listings currently have closed applications.")).toBeDefined()
    expect(screen.queryByRole("button", { name: /previous/i })).not.toBeInTheDocument()
    expect(screen.queryByRole("button", { name: /next/i })).not.toBeInTheDocument()
    expect(screen.queryByText(/page \d* of \d*/i)).not.toBeInTheDocument()
  })

  it("shows multiple open listings without pagination", () => {
    const view = render(
      <ListingBrowse
        listings={[
          { ...listing, name: "ListingA" },
          { ...listing, name: "ListingB" },
        ]}
        tab={TabsIndexEnum.open}
        paginationData={{
          currentPage: 1,
          totalPages: 1,
          itemsPerPage: 2,
          totalItems: 2,
          itemCount: 2,
        }}
        jurisdiction={jurisdiction}
      />
    )
    expect(view.queryByText("No listings currently have open applications.")).toBeNull()
    expect(view.getByText("ListingA")).toBeDefined()
    expect(view.getByText("ListingB")).toBeDefined()
    expect(screen.queryByRole("button", { name: /previous/i })).not.toBeInTheDocument()
    expect(screen.queryByRole("button", { name: /next/i })).not.toBeInTheDocument()
    expect(screen.getByText(/page 1 of 1/i)).toBeInTheDocument()
  })

  describe("show proper pagination navigation data", () => {
    it("show only next button when on first page", async () => {
      const { pushMock } = mockNextRouter()

      const view = render(
        <ListingBrowse
          listings={[
            { ...listing, name: "ListingA" },
            { ...listing, name: "ListingB" },
          ]}
          tab={TabsIndexEnum.open}
          jurisdiction={jurisdiction}
          paginationData={{
            currentPage: 1,
            totalPages: 2,
            itemsPerPage: 2,
            totalItems: 4,
            itemCount: 2,
          }}
        />
      )
      expect(view.queryByText("No listings currently have open applications.")).toBeNull()
      expect(view.getByText("ListingA")).toBeDefined()
      expect(view.getByText("ListingB")).toBeDefined()
      expect(screen.queryByRole("button", { name: /previous/i })).not.toBeInTheDocument()
      const nextPageButton = screen.getByRole("button", { name: /next/i })
      expect(nextPageButton).toBeInTheDocument()
      expect(screen.getByText(/page 1 of 2/i)).toBeInTheDocument()

      fireEvent.click(nextPageButton)
      await waitFor(() => {
        expect(pushMock).toBeCalledWith({ pathname: "/", query: "page=2" })
      })
    })

    it("show only previous button when on last page", async () => {
      const { pushMock } = mockNextRouter()

      const view = render(
        <ListingBrowse
          listings={[
            { ...listing, name: "ListingA" },
            { ...listing, name: "ListingB" },
          ]}
          tab={TabsIndexEnum.open}
          jurisdiction={jurisdiction}
          paginationData={{
            currentPage: 2,
            totalPages: 2,
            itemsPerPage: 2,
            totalItems: 4,
            itemCount: 2,
          }}
        />
      )
      expect(view.queryByText("No listings currently have open applications.")).toBeNull()
      expect(view.getByText("ListingA")).toBeDefined()
      expect(view.getByText("ListingB")).toBeDefined()
      expect(screen.queryByRole("button", { name: /next/i })).not.toBeInTheDocument()
      const previousPageButton = screen.getByRole("button", { name: /previous/i })
      expect(previousPageButton).toBeInTheDocument()
      expect(screen.getByText(/page 2 of 2/i)).toBeInTheDocument()

      fireEvent.click(previousPageButton)
      await waitFor(() => {
        expect(pushMock).toBeCalledWith({ pathname: "/", query: "page=1" })
      })
    })

    it("show only both navigation button when on midpoint page", async () => {
      const { pushMock } = mockNextRouter()

      const view = render(
        <ListingBrowse
          listings={[
            { ...listing, name: "ListingA" },
            { ...listing, name: "ListingB" },
          ]}
          tab={TabsIndexEnum.open}
          jurisdiction={jurisdiction}
          paginationData={{
            currentPage: 2,
            totalPages: 3,
            itemsPerPage: 2,
            totalItems: 6,
            itemCount: 2,
          }}
        />
      )
      expect(view.queryByText("No listings currently have open applications.")).toBeNull()
      expect(view.getByText("ListingA")).toBeDefined()
      expect(view.getByText("ListingB")).toBeDefined()

      const previousPageButton = screen.getByRole("button", { name: /previous/i })
      expect(previousPageButton).toBeInTheDocument()
      const nextPageButton = screen.getByRole("button", { name: /next/i })
      expect(nextPageButton).toBeInTheDocument()
      expect(screen.getByText(/page 2 of 3/i)).toBeInTheDocument()

      fireEvent.click(nextPageButton)
      await waitFor(() => {
        expect(pushMock).toBeCalledWith({ pathname: "/", query: "page=3" })
      })

      fireEvent.click(previousPageButton)
      await waitFor(() => {
        expect(pushMock).toBeCalledWith({ pathname: "/", query: "page=1" })
      })
    })
  })
})
