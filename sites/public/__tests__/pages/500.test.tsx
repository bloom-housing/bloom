import React from "react"
import { t } from "@bloom-housing/ui-components"
import { setupServer } from "msw/lib/node"
import { render, screen, mockNextRouter } from "../testUtils"
import ServerError from "../../src/pages/500"
import { ContentError } from "../../src/components/page/ContentError"

const server = setupServer()

beforeAll(() => {
  server.listen()
  mockNextRouter()
})

afterEach(() => server.resetHandlers())

afterAll(() => server.close())

describe("500 page", () => {
  // The page renders inside the site layout, which is where the jurisdiction's footer comes from.
  it("renders inside the site layout", () => {
    render(<ServerError />)

    expect(screen.getByRole("contentinfo")).toBeInTheDocument()
  })

  it("tells the visitor something went wrong", () => {
    render(<ContentError />)

    expect(
      screen.getByRole("heading", { name: t("errors.somethingWentWrong") })
    ).toBeInTheDocument()
    expect(screen.queryByText(t("errors.notFound.title"))).not.toBeInTheDocument()
  })
})
