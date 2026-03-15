import React from "react"
import userEvent from "@testing-library/user-event"
import { AuthContext } from "@bloom-housing/shared-helpers"
import {
  Agency,
  AuthService,
  User,
  UserService,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { fireEvent, mockNextRouter, render, screen, waitFor } from "../testUtils"
import CompleteAdvocateAccount from "../../src/pages/complete-advocate-account"

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}))

const mockAgencies: Agency[] = [
  { id: "agency-1", name: "Housing Authority" } as Agency,
  { id: "agency-2", name: "Community Services" } as Agency,
]

const mockExistingUser: Partial<User> = {
  id: "user-advocate-1",
  firstName: "Jane",
  middleName: "",
  lastName: "Doe",
  email: "jane.doe@example.com",
  agency: { id: "agency-1" } as Agency,
  phoneNumber: "(415) 555-1212",
  phoneType: "cell",
  address: {
    id: "addr-1",
    street: "123 Main St",
    street2: "",
    city: "Oakland",
    state: "CA",
    zipCode: "94612",
  },
}

const mockUserService = {
  getAdvocateFromConfirmationToken: jest.fn(),
  resendAdvocateConfirmation: jest.fn(),
  profile: jest.fn(),
  updateAdvocate: jest.fn(),
}

const mockAuthService = {
  confirm: jest.fn(),
}

const mockLoadProfile = jest.fn()

const renderPage = (queryToken = "valid-token") => {
  mockNextRouter({ token: queryToken })
  return render(
    <AuthContext.Provider
      value={{
        initialStateLoaded: true,
        profile: undefined,
        userService: mockUserService as unknown as UserService,
        authService: mockAuthService as unknown as AuthService,
        loadProfile: mockLoadProfile,
      }}
    >
      <CompleteAdvocateAccount agencies={mockAgencies} />
    </AuthContext.Provider>
  )
}

beforeAll(() => {
  window.scrollTo = jest.fn()
  Object.defineProperty(window, "location", {
    value: { origin: "https://public.example.com" },
    writable: true,
  })
})

beforeEach(() => {
  jest.clearAllMocks()
})

describe("CompleteAdvocateAccount page", () => {
  describe("token validation on load", () => {
    it("shows loading state initially then the form when the token is valid", async () => {
      mockUserService.getAdvocateFromConfirmationToken.mockResolvedValue(mockExistingUser)

      renderPage()

      await waitFor(() => {
        expect(
          screen.getByRole("heading", { name: "Create advocate account", level: 1 })
        ).toBeInTheDocument()
      })
      expect(
        screen.getByText("Please fill out the required fields to complete your account setup.")
      ).toBeInTheDocument()
      expect(screen.getByRole("textbox", { name: "First or given name" })).toBeInTheDocument()
      expect(screen.getByRole("textbox", { name: "Last or family name" })).toBeInTheDocument()
      expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument()
    })

    it("pre-populates name fields from the existing user", async () => {
      mockUserService.getAdvocateFromConfirmationToken.mockResolvedValue(mockExistingUser)

      renderPage()

      await waitFor(() => {
        expect(screen.getByRole("textbox", { name: "First or given name" })).toHaveValue("Jane")
      })
      expect(screen.getByRole("textbox", { name: "Last or family name" })).toHaveValue("Doe")
    })

    it("shows the expired/resend state when the token is invalid", async () => {
      mockUserService.getAdvocateFromConfirmationToken.mockRejectedValue(new Error("Not found"))

      renderPage()

      await waitFor(() => {
        expect(
          screen.getByText(
            "The link you used has expired. Enter the email address you used when requesting your account to receive a new one."
          )
        ).toBeInTheDocument()
      })
      expect(screen.getByRole("button", { name: "Resend link" })).toBeInTheDocument()
    })
  })

  describe("resend confirmation flow", () => {
    beforeEach(() => {
      mockUserService.getAdvocateFromConfirmationToken.mockRejectedValue(new Error("Not found"))
      mockUserService.resendAdvocateConfirmation.mockResolvedValue({ success: true })
    })

    it("shows success message after resending with a valid email", async () => {
      renderPage()

      await waitFor(() => {
        expect(screen.getByRole("button", { name: "Resend link" })).toBeInTheDocument()
      })

      const emailField = screen.getByRole("textbox", {
        name: "Your email address",
      })
      await userEvent.type(emailField, "jane.doe@example.com")
      fireEvent.click(screen.getByRole("button", { name: "Resend link" }))

      await waitFor(() => {
        expect(
          screen.getByText(/If there is an approved advocate account with that email/i)
        ).toBeInTheDocument()
      })

      expect(mockUserService.resendAdvocateConfirmation).toHaveBeenCalledWith({
        body: { email: "jane.doe@example.com", appUrl: "https://public.example.com" },
      })
    })

    it("shows validation error when resend is submitted without an email", async () => {
      renderPage()

      await waitFor(() => {
        expect(screen.getByRole("button", { name: "Resend link" })).toBeInTheDocument()
      })

      fireEvent.click(screen.getByRole("button", { name: "Resend link" }))

      await waitFor(() => {
        expect(screen.getByText("Please enter an email address")).toBeInTheDocument()
      })
      expect(mockUserService.resendAdvocateConfirmation).not.toHaveBeenCalled()
    })

    it("shows validation error when resend email format is invalid", async () => {
      renderPage()

      await waitFor(() => {
        expect(screen.getByRole("button", { name: "Resend link" })).toBeInTheDocument()
      })

      const emailField = screen.getByRole("textbox", {
        name: "Your email address",
      })
      await userEvent.type(emailField, "abcdefg12345")
      fireEvent.click(screen.getByRole("button", { name: "Resend link" }))

      await waitFor(() => {
        expect(screen.getByText("Please enter an email address")).toBeInTheDocument()
      })
      expect(mockUserService.resendAdvocateConfirmation).not.toHaveBeenCalled()
    })

    it("shows resent success state when resend returns 404", async () => {
      mockUserService.resendAdvocateConfirmation.mockRejectedValue({ response: { status: 404 } })

      renderPage()

      await waitFor(() => {
        expect(screen.getByRole("button", { name: "Resend link" })).toBeInTheDocument()
      })

      const emailField = screen.getByRole("textbox", {
        name: "Your email address",
      })
      await userEvent.type(emailField, "jane.doe@example.com")
      fireEvent.click(screen.getByRole("button", { name: "Resend link" }))

      await waitFor(() => {
        expect(
          screen.getByText(/If there is an approved advocate account with that email/i)
        ).toBeInTheDocument()
      })
    })

    it("shows an alert when resend fails with a non-404 error", async () => {
      mockUserService.resendAdvocateConfirmation.mockRejectedValue({ response: { status: 500 } })

      renderPage()

      await waitFor(() => {
        expect(screen.getByRole("button", { name: "Resend link" })).toBeInTheDocument()
      })

      const emailField = screen.getByRole("textbox", {
        name: "Your email address",
      })
      await userEvent.type(emailField, "jane.doe@example.com")
      fireEvent.click(screen.getByRole("button", { name: "Resend link" }))

      await waitFor(() => {
        expect(
          screen.getByText(/Something went wrong while creating your account\. Please try again\./i)
        ).toBeInTheDocument()
      })
      expect(screen.getByRole("button", { name: "Resend link" })).toBeInTheDocument()
    })
  })

  describe("form submission", () => {
    beforeEach(() => {
      mockUserService.getAdvocateFromConfirmationToken.mockResolvedValue(mockExistingUser)
    })

    it("renders all required form sections once the token is valid", async () => {
      renderPage("valid-token")

      await waitFor(() => {
        expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument()
      })

      // Name section (pre-filled from existing user)
      expect(screen.getByRole("textbox", { name: "First or given name" })).toHaveValue("Jane")
      expect(screen.getByRole("textbox", { name: "Last or family name" })).toHaveValue("Doe")

      // Address section
      expect(screen.getByRole("textbox", { name: "Street address" })).toBeInTheDocument()
      expect(screen.getByRole("textbox", { name: "City name" })).toBeInTheDocument()
      expect(screen.getByRole("textbox", { name: "Zip code" })).toBeInTheDocument()
      expect(screen.getByRole("combobox", { name: "State" })).toBeInTheDocument()

      // Phone section
      expect(
        screen.getByRole("combobox", { name: "What type of number is this?" })
      ).toBeInTheDocument()

      // Password section
      expect(screen.getByLabelText("Password")).toBeInTheDocument()
      expect(screen.getByLabelText("Re-enter your password")).toBeInTheDocument()
    })

    it("shows required validation errors when submit is clicked without filling required address fields", async () => {
      renderPage("valid-token")

      await waitFor(() => {
        expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument()
      })

      fireEvent.click(screen.getByRole("button", { name: "Submit" }))

      await waitFor(() => {
        expect(screen.getByText("Please enter a valid password")).toBeInTheDocument()
      })
    })
  })
})
