import React from "react"
import { mockNextRouter, render, screen } from "../testUtils"
import CreateAdvocateAccount from "../../src/pages/create-advocate-account"
import { setupServer } from "msw/lib/node"

const server = setupServer()

beforeAll(() => {
  server.listen()
  mockNextRouter()
  window.scrollTo = jest.fn()
})

afterEach(() => {
  server.resetHandlers()
  window.localStorage.clear()
  window.sessionStorage.clear()
})

afterAll(() => server.close())

describe("Create advocate page", () => {
  it("should render all page elements", () => {
    render(<CreateAdvocateAccount />)

    expect(
      screen.getByRole("heading", { name: "Request an account", level: 1 })
    ).toBeInTheDocument()
    expect(screen.getByText("Housing advocate")).toBeInTheDocument()

    expect(screen.getByText("Your name", { selector: "legend" })).toBeInTheDocument()
    expect(screen.getByRole("textbox", { name: "First or given name" })).toBeInTheDocument()
    expect(screen.getByRole("textbox", { name: "Middle name (optional)" })).toBeInTheDocument()
    expect(screen.getByRole("textbox", { name: "Last or family name" })).toBeInTheDocument()

    expect(screen.getByText("Your organization")).toBeInTheDocument()
    expect(screen.getByRole("combobox", { name: "Agency" })).toBeInTheDocument()
    expect(screen.getByText("Contact support if your agency is not listed")).toBeInTheDocument()

    expect(screen.getByRole("textbox", { name: "Your email address" })).toBeInTheDocument()
    expect(screen.getByText("Register with your work email address")).toBeInTheDocument()
    expect(screen.getByText("For example: example@mail.com")).toBeInTheDocument()

    expect(screen.getByRole("button", { name: "Create account" })).toBeInTheDocument()
    expect(screen.getAllByRole("link", { name: "Sign in" })).toHaveLength(2)
  })
})
