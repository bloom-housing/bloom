import React from "react"
import { setupServer } from "msw/lib/node"
import userEvent from "@testing-library/user-event"
import { Agency } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { fireEvent, mockNextRouter, render, screen, waitFor } from "../testUtils"
import CreateAdvocateAccount from "../../src/pages/create-advocate-account"
import { MessageContext } from "@bloom-housing/shared-helpers"
import { rest } from "msw"
import { user } from "@bloom-housing/shared-helpers/__tests__/testHelpers"

const mockAgencies = [
  { id: "agency-1", name: "Housing Authority" },
  { id: "agency-2", name: "Community Services" },
  { id: "agency-3", name: "Social Services" },
] as Agency[]

const TOAST_MESSAGE = {
  toastMessagesRef: { current: [] },
  addToast: jest.fn(),
}

const renderCreateAdvocateAccountPage = () =>
  render(
    <MessageContext.Provider value={TOAST_MESSAGE}>
      <CreateAdvocateAccount agencies={mockAgencies} />
    </MessageContext.Provider>
  )

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
  jest.clearAllMocks()
})

afterAll(() => server.close())

const fillAdvocateForm = async (
  firstName = "John",
  lastName = "Doe",
  email = "john.doe@example.com",
  agency = "agency-1"
) => {
  const firstNameField = screen.getByRole("textbox", { name: "First or given name" })
  const lastNameField = screen.getByRole("textbox", { name: "Last or family name" })
  const emailField = screen.getByRole("textbox", { name: "Email" })
  const agencySelect = screen.getByRole("combobox", { name: "Agency" })
  const submitButton = screen.getByRole("button", { name: "Request an account" })

  await userEvent.type(firstNameField, firstName)
  await userEvent.type(lastNameField, lastName)
  await userEvent.type(emailField, email)
  await userEvent.selectOptions(agencySelect, agency)

  return { firstNameField, lastNameField, emailField, agencySelect, submitButton }
}

describe("Create advocate page", () => {
  it("should render all page elements", () => {
    renderCreateAdvocateAccountPage()

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

    expect(screen.getByText("Your email address", { selector: "legend" })).toBeInTheDocument()
    expect(screen.getByRole("textbox", { name: "Email" })).toBeInTheDocument()
    expect(screen.getByText("Register with your work email address")).toBeInTheDocument()
    expect(screen.getByText("For example: example@mail.com")).toBeInTheDocument()

    expect(screen.getByRole("button", { name: "Request an account" })).toBeInTheDocument()
    expect(screen.getAllByRole("link", { name: "Sign in" })).toHaveLength(2)
  })

  it("should render all agencies in the select dropdown", () => {
    renderCreateAdvocateAccountPage()

    const agencySelect = screen.getByRole("combobox", { name: "Agency" })
    expect(agencySelect).toBeInTheDocument()

    mockAgencies.forEach((agency) => {
      expect(screen.getByText(agency.name)).toBeInTheDocument()
    })
  })

  describe("field validation errors", () => {
    it("should show validation errors on submit without filling any fields", async () => {
      renderCreateAdvocateAccountPage()

      const submitButton = screen.getByRole("button", { name: "Request an account" })
      await userEvent.click(submitButton)

      expect(screen.getByRole("textbox", { name: "First or given name" })).toBeInvalid()
      expect(screen.getByText("Please enter a first name")).toBeInTheDocument()

      expect(screen.getByRole("textbox", { name: "Last or family name" })).toBeInvalid()
      expect(screen.getByText("Please enter a last name")).toBeInTheDocument()

      expect(screen.getByRole("textbox", { name: "Email" })).toBeInvalid()
      expect(screen.getByText("Please enter a valid email address")).toBeInTheDocument()

      expect(screen.getByRole("combobox", { name: "Agency" })).toBeInvalid()
      expect(screen.getByText("This field is required")).toBeInTheDocument()
    })

    it("should show max character limit error for name fields", async () => {
      renderCreateAdvocateAccountPage()

      const submitButton = screen.getByRole("button", { name: "Request an account" })
      const firstNameField = screen.getByRole("textbox", { name: "First or given name" })
      const middleNameField = screen.getByRole("textbox", { name: "Middle name (optional)" })
      const lastNameField = screen.getByRole("textbox", { name: "Last or family name" })

      await userEvent.type(firstNameField, Array(65).fill("a").join(""))
      await userEvent.type(middleNameField, Array(65).fill("a").join(""))
      await userEvent.type(lastNameField, Array(65).fill("a").join(""))

      fireEvent.click(submitButton)

      expect(await screen.findAllByText("Must not be more than 64 characters.")).toHaveLength(3)
      expect(firstNameField).toBeInvalid()
      expect(middleNameField).toBeInvalid()
      expect(lastNameField).toBeInvalid()
    })

    it("should show email validation error for invalid email format", async () => {
      renderCreateAdvocateAccountPage()

      const emailField = screen.getByRole("textbox", { name: "Email" })
      const submitButton = screen.getByRole("button", { name: "Request an account" })

      await userEvent.type(emailField, "invalid-email")
      fireEvent.click(submitButton)

      expect(emailField).toBeInvalid()
      expect(await screen.findByText("Please enter a valid email address")).toBeInTheDocument()
    })
  })

  describe("Form submission", () => {
    it("should successfully submit a valid form", async () => {
      const { pushMock } = mockNextRouter()
      server.use(
        rest.post("http://localhost/api/adapter/user/advocate", (_req, res, ctx) => {
          return res(ctx.json(user))
        })
      )

      renderCreateAdvocateAccountPage()

      const { submitButton } = await fillAdvocateForm()
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(pushMock).toBeCalledWith("create-advocate-account-confirmation")
      })
    })

    it("should handle 400 error with specific error message", async () => {
      jest.spyOn(console, "error").mockImplementation()
      const response = {
        title: "Internal",
        status: 400,
        message: "errorSaving",
        value:
          "Oops! Looks like something went wrong. Please try again. Contact your housing department if you're still experiencing issues.",
      }
      server.use(
        rest.post("http://localhost/api/adapter/user/advocate", (_req, res, ctx) => {
          return res(
            ctx.status(response.status),
            ctx.json({
              message: response.message,
            })
          )
        })
      )

      renderCreateAdvocateAccountPage()

      const { submitButton } = await fillAdvocateForm()
      fireEvent.click(submitButton)

      await waitFor(() => {
        const alert = screen.getByRole("alert")
        expect(alert).toHaveTextContent(response.value)
      })
    })

    it("should handle 409 error for unapproved advocate", async () => {
      jest.spyOn(console, "error").mockImplementation()
      const response = {
        title: "Internal",
        status: 409,
        message: "advocateNeedsApproval",
        value: "This email is still awaiting account approval. Contact us for more information.",
      }
      server.use(
        rest.post("http://localhost/api/adapter/user/advocate", (_req, res, ctx) => {
          return res(
            ctx.status(response.status),
            ctx.json({
              message: response.message,
            })
          )
        })
      )

      renderCreateAdvocateAccountPage()

      const { submitButton } = await fillAdvocateForm()
      fireEvent.click(submitButton)

      await waitFor(() => {
        const alert = screen.getByRole("alert")
        expect(alert).toHaveTextContent(response.value)
      })
    })

    it("should handle 409 error for email already in use", async () => {
      jest.spyOn(console, "error").mockImplementation()
      const response = {
        title: "Internal",
        status: 409,
        message: "emailInUse",
        value: "Email is already in use",
      }
      server.use(
        rest.post("http://localhost/api/adapter/user/advocate", (_req, res, ctx) => {
          return res(
            ctx.status(response.status),
            ctx.json({
              message: response.message,
            })
          )
        })
      )

      renderCreateAdvocateAccountPage()

      const { submitButton } = await fillAdvocateForm()
      fireEvent.click(submitButton)

      await waitFor(() => {
        const alert = screen.getByRole("alert")
        expect(alert).toHaveTextContent(response.value)
      })
    })

    it("should handle generic error on form submission", async () => {
      jest.spyOn(console, "error").mockImplementation()
      const response = {
        title: "Generic",
        status: 401, // Used 401 code here to mock a unhandled status code.
        value:
          "Something went wrong while creating your account. Please try again. Contact your housing department if you're still experiencing issues.",
      }
      server.use(
        rest.post("http://localhost/api/adapter/user/advocate", (_req, res, ctx) => {
          return res(ctx.status(response.status))
        })
      )

      renderCreateAdvocateAccountPage()

      const { submitButton } = await fillAdvocateForm()
      fireEvent.click(submitButton)

      await waitFor(() => {
        const alert = screen.getByRole("alert")
        expect(alert).toHaveTextContent(response.value)
      })
    })
  })
})
