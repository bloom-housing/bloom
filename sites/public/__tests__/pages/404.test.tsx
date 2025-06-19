import React from "react"
import { setupServer } from "msw/lib/node"
import { render, screen, mockNextRouter } from "../testUtils"
import { Content404 } from "../../src/components/page/Content404"

const server = setupServer()

beforeAll(() => {
  server.listen()
  mockNextRouter({ token: "ex4mpl3-tok3n" })
})

afterEach(() => server.resetHandlers())

afterAll(() => server.close())

describe("404 page", () => {
  it("renders all page content", () => {
    render(<Content404 />)
    expect(screen.getByText("404")).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: "Page Not Found", level: 1 })).toBeInTheDocument()
    expect(
      screen.getByText("Sorry, we couldn't find the page you're looking for.")
    ).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "Back to home" })).toHaveAttribute("href", "/")
  })
})
