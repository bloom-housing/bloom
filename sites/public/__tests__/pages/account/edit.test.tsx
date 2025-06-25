import React from "react"
import { act } from "react-dom/test-utils"
import { render, screen, waitFor, mockNextRouter } from "../../testUtils"
import userEvent from "@testing-library/user-event"
import Edit from "../../../src/pages/account/edit"
import { user } from "@bloom-housing/shared-helpers/__tests__/testHelpers"
import { AuthContext } from "@bloom-housing/shared-helpers"

const mockUserService = {
  retrieve: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  create: jest.fn(),
  list: jest.fn(),
  listAsCsv: jest.fn(),
  forgotPassword: jest.fn(),
  invite: jest.fn(),
  requestSingleUseCode: jest.fn(),
  resendConfirmation: jest.fn(),
  resendPartnerConfirmation: jest.fn(),
  isUserConfirmationTokenValid: jest.fn(),
  favoriteListings: jest.fn(),
  modifyFavoriteListings: jest.fn(),
  profile: jest.fn(),
}

beforeEach(() => {
  jest.clearAllMocks()
})

const renderEditPage = (userOverrides = {}) => {
  const testUser = {
    ...user,
    listings: [],
    jurisdictions: [],
    ...userOverrides,
  }

  mockUserService.retrieve.mockResolvedValue(testUser)

  return render(
    <AuthContext.Provider
      value={{
        profile: testUser,
        userService: mockUserService,
      }}
    >
      <Edit />
    </AuthContext.Provider>
  )
}

describe("<Edit>", () => {
  mockNextRouter()

  describe("Name form", () => {
    it("should update name successfully", async () => {
      const updatedUser = {
        ...user,
        firstName: "Jane",
        lastName: "Smith",
        listings: [],
        jurisdictions: [],
      }
      mockUserService.update.mockResolvedValue(updatedUser)

      renderEditPage()

      await waitFor(() => {
        expect(screen.getByDisplayValue("First")).toBeInTheDocument()
      })

      const firstNameField = screen.getByLabelText(/given name/i, { selector: "input" })
      const lastNameField = screen.getByLabelText(/family name/i, { selector: "input" })
      const updateButtons = screen.getAllByText("Update")

      await act(async () => {
        await userEvent.clear(firstNameField)
        await userEvent.type(firstNameField, "Jane")
        await userEvent.clear(lastNameField)
        await userEvent.type(lastNameField, "Smith")
        await userEvent.click(updateButtons[0])
      })

      await waitFor(() => {
        expect(mockUserService.update).toHaveBeenCalledWith({ body: updatedUser })
      })
    })

    it("should handle name update errors", async () => {
      mockUserService.update.mockRejectedValue(new Error("Server error"))

      renderEditPage()

      await waitFor(() => {
        expect(screen.getByDisplayValue("First")).toBeInTheDocument()
      })

      const updateButtons = screen.getAllByText("Update")

      await act(async () => {
        await userEvent.click(updateButtons[0])
      })

      await waitFor(() => {
        expect(
          screen.getByText(/There was an error. Please try again, or contact support for help./i)
        ).toBeInTheDocument()
      })
    })
  })

  describe("Date of Birth form", () => {
    it("should update date of birth successfully", async () => {
      const updatedUser = {
        ...user,
        dob: new Date("1990-05-15"),
        listings: [],
        jurisdictions: [],
      }
      mockUserService.update.mockResolvedValue(updatedUser)

      renderEditPage()

      await waitFor(() => {
        expect(screen.getByDisplayValue("First")).toBeInTheDocument()
      })

      const dayField = screen.getByLabelText(/day/i, { selector: "input" })
      const monthField = screen.getByLabelText(/month/i, { selector: "input" })
      const yearField = screen.getByLabelText(/year/i, { selector: "input" })
      const updateButtons = screen.getAllByText("Update")

      await act(async () => {
        await userEvent.clear(monthField)
        await userEvent.type(monthField, "05")
        await userEvent.clear(dayField)
        await userEvent.type(dayField, "15")
        await userEvent.clear(yearField)
        await userEvent.type(yearField, "1990")
      })

      await act(async () => {
        await userEvent.click(updateButtons[1])
      })

      await waitFor(() => {
        expect(mockUserService.update).toHaveBeenCalledWith({
          body: expect.objectContaining({
            dob: new Date("1990-05-15"),
          }),
        })
      })
    })

    it("should handle date of birth update errors", async () => {
      mockUserService.update.mockRejectedValue(new Error("Server error"))

      renderEditPage()

      await waitFor(() => {
        expect(screen.getByDisplayValue("First")).toBeInTheDocument()
      })

      const dayField = screen.getByLabelText(/day/i, { selector: "input" })
      const monthField = screen.getByLabelText(/month/i, { selector: "input" })
      const yearField = screen.getByLabelText(/year/i, { selector: "input" })
      const updateButtons = screen.getAllByText("Update")

      await act(async () => {
        await userEvent.clear(monthField)
        await userEvent.type(monthField, "01")
        await userEvent.clear(dayField)
        await userEvent.type(dayField, "01")
        await userEvent.clear(yearField)
        await userEvent.type(yearField, "1990")
      })

      await act(async () => {
        await userEvent.click(updateButtons[1])
      })

      await waitFor(() => {
        expect(
          screen.getByText(/There was an error. Please try again, or contact support for help./i)
        ).toBeInTheDocument()
      })
    })

    it("should show validation error for invalid date of birth (under 18)", async () => {
      renderEditPage()

      await waitFor(() => {
        expect(screen.getByDisplayValue("First")).toBeInTheDocument()
      })

      // Try to set a date that would make user under 18
      const currentYear = new Date().getFullYear()
      const underageYear = currentYear - 16 // 16 years old

      const dayField = screen.getByLabelText(/day/i, { selector: "input" })
      const monthField = screen.getByLabelText(/month/i, { selector: "input" })
      const yearField = screen.getByLabelText(/year/i, { selector: "input" })
      const updateButtons = screen.getAllByText("Update")

      await act(async () => {
        await userEvent.clear(monthField)
        await userEvent.type(monthField, "01")
        await userEvent.clear(dayField)
        await userEvent.type(dayField, "01")
        await userEvent.clear(yearField)
        await userEvent.type(yearField, underageYear.toString())
      })

      await act(async () => {
        await userEvent.click(updateButtons[1])
      })

      await waitFor(() => {
        expect(
          screen.getByText(/Please enter a valid Date of Birth, must be 18 or older/i)
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
      mockUserService.update.mockResolvedValue(updatedUser)

      renderEditPage()

      await waitFor(() => {
        expect(screen.getByDisplayValue("first.last@bloom.com")).toBeInTheDocument()
      })

      const emailField = screen.getByLabelText(/email/i, { selector: "input" })
      const updateButtons = screen.getAllByText("Update")

      await act(async () => {
        await userEvent.clear(emailField)
        await userEvent.type(emailField, "new.email@example.com")
      })

      await act(async () => {
        await userEvent.click(updateButtons[2])
      })

      await waitFor(() => {
        expect(mockUserService.update).toHaveBeenCalledWith({ body: updatedUser })
      })
    })

    it("should show validation errors for invalid email", async () => {
      renderEditPage()

      await waitFor(() => {
        expect(screen.getByDisplayValue("first.last@bloom.com")).toBeInTheDocument()
      })

      const emailField = screen.getByLabelText(/email/i, { selector: "input" })
      const updateButtons = screen.getAllByText("Update")

      await act(async () => {
        await userEvent.clear(emailField)
        await userEvent.type(emailField, "invalid-email")
      })

      await act(async () => {
        await userEvent.click(updateButtons[2])
      })

      await waitFor(() => {
        expect(screen.getByText(/Please enter an email address/i)).toBeInTheDocument()
      })
    })
  })

  describe("Password form", () => {
    it("should update password successfully", async () => {
      const updatedUser = { ...user, listings: [], jurisdictions: [] }
      mockUserService.update.mockResolvedValue(updatedUser)

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
      const updateButtons = screen.getAllByText("Update")

      await act(async () => {
        await userEvent.type(currentPasswordField, "currentPassword123!")
        await userEvent.type(newPasswordField, "newPassword123!")
        await userEvent.type(confirmPasswordField, "newPassword123!")
        await userEvent.click(updateButtons[3])
      })

      await waitFor(() => {
        expect(mockUserService.update).toHaveBeenCalled()
      })
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
      const updateButtons = screen.getAllByText("Update")

      await act(async () => {
        await userEvent.type(currentPasswordField, "currentPassword123!")
        await userEvent.type(newPasswordField, "newPassword123!")
        await userEvent.type(confirmPasswordField, "differentPassword123!")
        await userEvent.click(updateButtons[3])
      })

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

      const updateButtons = screen.getAllByText("Update")

      await act(async () => {
        await userEvent.click(updateButtons[3])
      })

      await waitFor(() => {
        expect(screen.getByText(/Password fields may not be empty/i)).toBeInTheDocument()
      })
    })

    it("should show error when current password is incorrect", async () => {
      mockUserService.update.mockRejectedValue({
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
      const updateButtons = screen.getAllByText("Update")

      await act(async () => {
        await userEvent.type(currentPasswordField, "wrongPassword")
        await userEvent.type(newPasswordField, "newPassword123!")
        await userEvent.type(confirmPasswordField, "newPassword123!")
      })

      await act(async () => {
        await userEvent.click(updateButtons[3])
      })

      await waitFor(() => {
        expect(screen.getByText(/Invalid current password. Please try again./i)).toBeInTheDocument()
      })
    })
  })
})
