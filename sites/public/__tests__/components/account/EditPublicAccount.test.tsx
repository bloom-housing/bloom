import React from "react"
import userEvent from "@testing-library/user-event"
import { useRouter } from "next/router"
import { user } from "@bloom-housing/shared-helpers/__tests__/testHelpers"
import { AuthContext } from "@bloom-housing/shared-helpers"
import { User, UserService } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import Edit from "../../../src/pages/account/edit"
import { render, screen, waitFor } from "../../testUtils"

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}))

const mockUserService = {
  retrieve: jest.fn(),
  updatePublic: jest.fn(),
}

const renderEditPage = (userOverrides = {}) => {
  const testUser = {
    ...user,
    firstName: "First",
    middleName: "Middle",
    lastName: "Last",
    email: "first.last@bloom.com",
    isAdvocate: false,
    isApproved: true,
    listings: [],
    jurisdictions: [],
    ...userOverrides,
  }

  mockUserService.retrieve.mockResolvedValue(testUser)

  return render(
    <AuthContext.Provider
      value={{
        profile: testUser as unknown as User,
        userService: mockUserService as unknown as UserService,
      }}
    >
      <Edit agencies={[]} />
    </AuthContext.Provider>
  )
}

describe("EditPublicAccount", () => {
  let consoleWarnSpy: jest.SpyInstance

  beforeEach(() => {
    jest.clearAllMocks()
    consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation(() => undefined)
    ;(useRouter as jest.Mock).mockReturnValue({
      pathname: "/",
      query: {},
      push: jest.fn(),
      back: jest.fn(),
      replace: jest.fn(),
    })
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it("loads the user and renders all public account sections", async () => {
    renderEditPage()

    await waitFor(() => {
      expect(mockUserService.retrieve).toHaveBeenCalledWith({ id: "user_1" })
    })

    // These are the IDs of the form sections we expect to appear
    await waitFor(() => {
      expect(document.getElementById("update-name")).toBeInTheDocument()
      expect(document.getElementById("update-birthdate")).toBeInTheDocument()
      expect(document.getElementById("update-email")).toBeInTheDocument()
      expect(document.getElementById("update-password")).toBeInTheDocument()
    })
  })

  describe("Name form", () => {
    it("should update name successfully", async () => {
      const updatedUser = {
        ...user,
        firstName: "Jane",
        lastName: "Smith",
        listings: [],
        jurisdictions: [],
      }
      mockUserService.updatePublic.mockResolvedValue(updatedUser)

      renderEditPage()

      await waitFor(() => {
        expect(screen.getByDisplayValue("First")).toBeInTheDocument()
      })

      const firstNameField = screen.getByLabelText("Given name", { selector: "input" })
      const lastNameField = screen.getByLabelText("Family name", { selector: "input" })
      const updateButton = document.getElementById("account-submit-name")

      await userEvent.clear(firstNameField)
      await userEvent.type(firstNameField, "Jane")
      await userEvent.clear(lastNameField)
      await userEvent.type(lastNameField, "Smith")
      await userEvent.click(updateButton)

      await waitFor(() => {
        expect(mockUserService.updatePublic).toHaveBeenCalledWith({
          body: expect.objectContaining(updatedUser),
        })
      })
    })

    it("should handle name update errors", async () => {
      mockUserService.updatePublic.mockRejectedValue(new Error("Server error"))

      renderEditPage()

      await waitFor(() => {
        expect(screen.getByDisplayValue("First")).toBeInTheDocument()
      })

      const updateButton = document.getElementById("account-submit-name")

      await userEvent.click(updateButton)

      await waitFor(() => {
        expect(
          screen.getByText("There was an error. Please try again, or contact support for help.")
        ).toBeInTheDocument()
      })

      expect(consoleWarnSpy).toHaveBeenCalled()
    })
  })

  describe("Date of birth form", () => {
    it("should update date of birth successfully", async () => {
      const updatedUser = {
        ...user,
        dob: new Date("1990-05-15"),
        listings: [],
        jurisdictions: [],
      }
      mockUserService.updatePublic.mockResolvedValue(updatedUser)

      renderEditPage()

      await waitFor(() => {
        expect(screen.getByDisplayValue("First")).toBeInTheDocument()
      })

      const dayField = screen.getByLabelText("Day", { selector: "input" })
      const monthField = screen.getByLabelText("Month", { selector: "input" })
      const yearField = screen.getByLabelText("Year", { selector: "input" })
      const updateButton = document.getElementById("account-submit-dob")

      await userEvent.clear(monthField)
      await userEvent.type(monthField, "05")
      await userEvent.clear(dayField)
      await userEvent.type(dayField, "15")
      await userEvent.clear(yearField)
      await userEvent.type(yearField, "1990")

      await userEvent.click(updateButton)

      await waitFor(() => {
        expect(mockUserService.updatePublic).toHaveBeenCalledWith({
          body: expect.objectContaining({
            dob: new Date("1990-05-15"),
          }),
        })
      })
    })

    it("should handle date of birth update errors", async () => {
      mockUserService.updatePublic.mockRejectedValue(new Error("Server error"))

      renderEditPage()

      await waitFor(() => {
        expect(screen.getByDisplayValue("First")).toBeInTheDocument()
      })

      const dayField = screen.getByLabelText("Day", { selector: "input" })
      const monthField = screen.getByLabelText("Month", { selector: "input" })
      const yearField = screen.getByLabelText("Year", { selector: "input" })
      const updateButton = document.getElementById("account-submit-dob")

      await userEvent.clear(monthField)
      await userEvent.type(monthField, "01")
      await userEvent.clear(dayField)
      await userEvent.type(dayField, "01")
      await userEvent.clear(yearField)
      await userEvent.type(yearField, "1990")
      await userEvent.click(updateButton)

      await waitFor(() => {
        expect(
          screen.getByText("There was an error. Please try again, or contact support for help.")
        ).toBeInTheDocument()
      })

      expect(consoleWarnSpy).toHaveBeenCalled()
    })

    it("should show validation error for invalid date of birth (under 18)", async () => {
      renderEditPage()

      await waitFor(() => {
        expect(screen.getByDisplayValue("First")).toBeInTheDocument()
      })

      // Try to set a date that would make user under 18
      const currentYear = new Date().getFullYear()
      const underageYear = currentYear - 16 // 16 years old

      const dayField = screen.getByLabelText("Day", { selector: "input" })
      const monthField = screen.getByLabelText("Month", { selector: "input" })
      const yearField = screen.getByLabelText("Year", { selector: "input" })
      const updateButton = document.getElementById("account-submit-dob")

      await userEvent.clear(monthField)
      await userEvent.type(monthField, "01")
      await userEvent.clear(dayField)
      await userEvent.type(dayField, "01")
      await userEvent.clear(yearField)
      await userEvent.type(yearField, underageYear.toString())

      await userEvent.click(updateButton)

      await waitFor(() => {
        expect(
          screen.getByText("Please enter a valid date of birth, must be 18 or older")
        ).toBeInTheDocument()
      })
    })
  })

  describe("Email form", () => {
    it("should update email successfully", async () => {
      const updatedUser = {
        ...user,
        email: "first.last@bloom.com",
        newEmail: "new.email@example.com",
        appUrl: "http://localhost",
        listings: [],
        jurisdictions: [],
      }
      mockUserService.updatePublic.mockResolvedValue(updatedUser)

      renderEditPage()

      await waitFor(() => {
        expect(screen.getByDisplayValue("first.last@bloom.com")).toBeInTheDocument()
      })

      const emailField = screen.getByLabelText(/email/i, { selector: "input" })
      const updateButton = document.getElementById("account-submit-email")

      await userEvent.clear(emailField)
      await userEvent.type(emailField, "new.email@example.com")

      await userEvent.click(updateButton)

      await waitFor(() => {
        expect(mockUserService.updatePublic).toHaveBeenCalledWith({
          body: expect.objectContaining(updatedUser),
        })
      })
    })

    it("should show validation errors for invalid email", async () => {
      renderEditPage()

      await waitFor(() => {
        expect(screen.getByDisplayValue("first.last@bloom.com")).toBeInTheDocument()
      })

      const emailField = screen.getByLabelText(/email/i, { selector: "input" })
      const updateButton = document.getElementById("account-submit-email")

      await userEvent.clear(emailField)
      await userEvent.type(emailField, "invalid-email")

      await userEvent.click(updateButton)

      await waitFor(() => {
        expect(screen.getByText(/Please enter an email address/i)).toBeInTheDocument()
      })
    })
  })

  describe("Password form", () => {
    it("should update password successfully", async () => {
      const updatedUser = { ...user, listings: [], jurisdictions: [] }
      mockUserService.updatePublic.mockResolvedValue(updatedUser)

      renderEditPage()

      await waitFor(() => {
        expect(
          screen.getByLabelText(/current password/i, { selector: "input" })
        ).toBeInTheDocument()
      })

      const currentPasswordField = screen.getByLabelText(/current password/i, { selector: "input" })
      const newPasswordField = screen.getByLabelText(/^new password$/i, { selector: "input" })
      const confirmPasswordField = screen.getByLabelText(/^confirm new password$/i, {
        selector: "input",
      })
      const updateButton = document.getElementById("account-submit-password")

      await userEvent.type(currentPasswordField, "currentPassword123!")
      await userEvent.type(newPasswordField, "newPassword123!")
      await userEvent.type(confirmPasswordField, "newPassword123!")
      await userEvent.click(updateButton)

      expect(mockUserService.updatePublic).toHaveBeenCalled()
    })

    it("should show error when passwords don't match", async () => {
      renderEditPage()

      await waitFor(() => {
        expect(
          screen.getByLabelText(/current password/i, { selector: "input" })
        ).toBeInTheDocument()
      })

      const currentPasswordField = screen.getByLabelText(/current password/i, { selector: "input" })
      const newPasswordField = screen.getByLabelText(/^new password$/i, { selector: "input" })
      const confirmPasswordField = screen.getByLabelText(/^confirm new password$/i, {
        selector: "input",
      })
      const updateButton = document.getElementById("account-submit-password")

      await userEvent.type(currentPasswordField, "currentPassword123!")
      await userEvent.type(newPasswordField, "newPassword123!")
      await userEvent.type(confirmPasswordField, "differentPassword123!")
      await userEvent.click(updateButton)

      await waitFor(() => {
        expect(screen.getByText(/The passwords do not match/i)).toBeInTheDocument()
      })
    })

    it("should show error when password fields are empty", async () => {
      renderEditPage()

      await waitFor(() => {
        expect(
          screen.getByLabelText(/current password/i, { selector: "input" })
        ).toBeInTheDocument()
      })

      const updateButton = document.getElementById("account-submit-password")

      await userEvent.click(updateButton)

      await waitFor(() => {
        expect(screen.getByText(/Password fields may not be empty/i)).toBeInTheDocument()
      })
    })

    it("should show error when current password is incorrect", async () => {
      mockUserService.updatePublic.mockRejectedValue({
        response: { status: 401 },
      })

      renderEditPage()

      await waitFor(() => {
        expect(
          screen.getByLabelText(/current password/i, { selector: "input" })
        ).toBeInTheDocument()
      })

      const currentPasswordField = screen.getByLabelText(/current password/i, { selector: "input" })
      const newPasswordField = screen.getByLabelText(/^new password$/i, { selector: "input" })
      const confirmPasswordField = screen.getByLabelText(/^confirm new password$/i, {
        selector: "input",
      })
      const updateButton = document.getElementById("account-submit-password")

      await userEvent.type(currentPasswordField, "wrongPassword")
      await userEvent.type(newPasswordField, "newPassword123!")
      await userEvent.type(confirmPasswordField, "newPassword123!")

      await userEvent.click(updateButton)

      await waitFor(() => {
        expect(screen.getByText(/Invalid current password. Please try again./i)).toBeInTheDocument()
      })

      expect(consoleWarnSpy).toHaveBeenCalled()
    })
  })
})
