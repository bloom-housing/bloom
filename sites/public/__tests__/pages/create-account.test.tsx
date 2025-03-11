import { AuthContext } from "@bloom-housing/shared-helpers"
import { fireEvent, mockNextRouter, render, waitFor, screen, act } from "../testUtils"
import { user } from "@bloom-housing/shared-helpers/__tests__/testHelpers"
import React from "react"
import CreateAccount from "../../src/pages/create-account"
import userEvent from "@testing-library/user-event"

beforeAll(() => {
  mockNextRouter()
  window.scrollTo = jest.fn()
})

const createUserFn = jest.fn()

const renderCreateAccountPage = () =>
  render(
    <AuthContext.Provider
      value={{
        profile: {
          ...user,
          listings: [],
          jurisdictions: [],
        },
        createUser: createUserFn,
      }}
    >
      <CreateAccount />
    </AuthContext.Provider>
  )

describe("Create Account Page", () => {
  it("should render the page with all fileds, buttons and links", () => {
    renderCreateAccountPage()

    const verifyInitialInput = (input: HTMLElement) => {
      expect(input).toBeInTheDocument()
      expect(input).toBeValid()
      expect(input).toBeEnabled()
    }

    expect(screen.getByRole("heading", { name: /create account/i, level: 1 })).toBeInTheDocument()

    expect(screen.getByText("Your Name", { selector: "legend" })).toBeInTheDocument()
    verifyInitialInput(screen.getByRole("textbox", { name: /first or given name/i }))
    verifyInitialInput(screen.getByRole("textbox", { name: /middle name \(optional\)/i }))
    verifyInitialInput(screen.getByRole("textbox", { name: /last or family name/i }))

    expect(screen.getByText("Your date of birth", { selector: "legend" })).toBeInTheDocument()
    verifyInitialInput(screen.getByRole("textbox", { name: /month/i }))
    verifyInitialInput(screen.getByRole("textbox", { name: /day/i }))
    verifyInitialInput(screen.getByRole("textbox", { name: /year/i }))
    expect(
      screen.getByText("This is collected to verify that you are at least 18 years old.", {
        selector: "p",
      })
    ).toBeInTheDocument()
    expect(screen.getByText("For example: 01 19 2000", { selector: "p" })).toBeInTheDocument()

    verifyInitialInput(screen.getByRole("textbox", { name: /your email address/i }))

    const passwordInput = screen.getByLabelText(/^password/i, { selector: "input" })
    verifyInitialInput(passwordInput)
    expect(passwordInput).toHaveAttribute("type", "password")
    expect(
      screen.getByText(
        "Must be at least 12 characters and include at least one lowercase letter, one uppercase letter, one number, and one special character (#?!@$%^&*-)."
      )
    ).toBeInTheDocument()
    const passwordConfirmInput = screen.getByLabelText(/re-enter your password/i, {
      selector: "input",
    })
    verifyInitialInput(passwordConfirmInput)
    expect(passwordConfirmInput).toHaveAttribute("type", "password")

    const createAccountButton = screen.getByRole("button", { name: /create account/i })
    expect(createAccountButton).toBeInTheDocument()
    expect(createAccountButton).toBeEnabled()

    expect(
      screen.getByRole("heading", { level: 2, name: /already have an account\?/i })
    ).toBeInTheDocument()

    const signInLink = screen.getByRole("link", { name: /sign in/i })
    expect(signInLink).toBeInTheDocument()
    expect(signInLink).toHaveAttribute("href", "/sign-in")
  })

  describe("Field validation errors", () => {
    it("should show no alerts on initial load", () => {
      renderCreateAccountPage()

      expect(screen.queryByText("Please enter a First Name")).not.toBeInTheDocument()
      expect(screen.queryByText("Must not be more than 64 characters.")).not.toBeInTheDocument()
      expect(screen.queryByText("Please enter a Last Name")).not.toBeInTheDocument()
      expect(
        screen.queryByText("Please enter a valid Date of Birth, must be 18 or older")
      ).not.toBeInTheDocument()
      expect(screen.queryByText("Please enter a valid email address")).not.toBeInTheDocument()
      expect(screen.queryByText("Please enter a valid password")).not.toBeInTheDocument()
      expect(screen.queryByText("The passwords do not match")).not.toBeInTheDocument()
    })

    it("show alerts on 'Create Account' click without filling any fields", async () => {
      renderCreateAccountPage()

      const createAccountButton = screen.getByRole("button", { name: /create account/i })
      expect(createAccountButton).toBeInTheDocument()
      await userEvent.click(createAccountButton)

      expect(screen.getByRole("textbox", { name: /first or given name/i })).toBeInvalid()
      expect(screen.getByText("Please enter a First Name")).toBeInTheDocument()

      expect(screen.getByRole("textbox", { name: /last or family name/i })).toBeInvalid()
      expect(screen.getByText("Please enter a Last Name")).toBeInTheDocument()

      expect(screen.getByRole("textbox", { name: /month/i })).toBeInvalid()
      expect(screen.getByRole("textbox", { name: /day/i })).toBeInvalid()
      expect(screen.getByRole("textbox", { name: /year/i })).toBeInvalid()
      expect(
        screen.getByText("Please enter a valid Date of Birth, must be 18 or older")
      ).toBeInTheDocument()

      expect(screen.getByRole("textbox", { name: /your email address/i })).toBeInvalid()
      expect(screen.getByText("Please enter a valid email address")).toBeInTheDocument()

      expect(screen.getByLabelText(/^password/i, { selector: "input" })).toBeInvalid()
      expect(screen.getByText("Please enter a valid password")).toBeInTheDocument()

      expect(screen.queryByText("Must not be more than 64 characters.")).not.toBeInTheDocument()
      expect(screen.queryByText("The passwords do not match")).not.toBeInTheDocument()
    })

    it("show max character limit error for string fields", async () => {
      renderCreateAccountPage()

      const createAccountButton = screen.getByRole("button", { name: /create account/i })
      const firstNameField = screen.getByRole("textbox", { name: /first or given name/i })
      const middleNameField = screen.getByRole("textbox", { name: /middle name \(optional\)/i })
      const lastNameField = screen.getByRole("textbox", { name: /last or family name/i })
      expect(firstNameField).toBeInTheDocument()
      expect(middleNameField).toBeInTheDocument()
      expect(lastNameField).toBeInTheDocument()
      expect(createAccountButton).toBeInTheDocument()
      await userEvent.type(firstNameField, Array(65).fill("a").join(""))
      await userEvent.type(middleNameField, Array(65).fill("a").join(""))
      await userEvent.type(lastNameField, Array(65).fill("a").join(""))
      fireEvent.click(createAccountButton)
      expect(await screen.findAllByText("Must not be more than 64 characters.")).toHaveLength(3)
      expect(firstNameField).toBeInvalid()
      expect(middleNameField).toBeInvalid()
      expect(lastNameField).toBeInvalid()
      expect(screen.queryByText("Please enter a First Name")).not.toBeInTheDocument()
      expect(screen.queryByText("Please enter a Last Name")).not.toBeInTheDocument()
    })

    describe("show password error on invalid passwords", () => {
      const TEST_PASSWORDS = [
        {
          password: "P@ssw0rd#123",
          description: "Valid password with all requirements met",
          valid: true,
        },
        {
          password: "Secure!Pa$$123",
          description: "Valid password with multiple special characters",
          valid: true,
        },
        {
          password: "AbCdEfG1!2@3#",
          description: "Valid password with alternating character types",
          valid: true,
        },
        {
          password: "ThisIs@Valid1",
          description: "Valid password with exactly 12 characters",
          valid: true,
        },
        {
          password: "L0ng&C0mpl3xP@ssw0rd",
          description: "Valid longer password (20 characters)",
          valid: true,
        },
        {
          password: "Sh0rt!",
          description: "Too short (only 6 characters)",
          valid: false,
          reason: "Does not meet minimum length of 12 characters",
        },
        {
          password: "Almost@12ch",
          description: "Almost long enough (11 characters)",
          valid: false,
          reason: "Does not meet minimum length of 12 characters",
        },
        {
          password: "NO_LOWERCASE1!",
          description: "Missing lowercase letter",
          valid: false,
          reason: "Does not contain at least one lowercase letter",
        },
        {
          password: "no_uppercase1!",
          description: "Missing uppercase letter",
          valid: false,
          reason: "Does not contain at least one uppercase letter",
        },
        {
          password: "NoNumbers!@ABC",
          description: "Missing number",
          valid: false,
          reason: "Does not contain at least one number",
        },
        {
          password: "NoSpecialChar12",
          description: "Missing special character",
          valid: false,
          reason: "Does not contain at least one special character (#?!@$%^&*-)",
        },
        {
          password: "WrongSpecial_12",
          description: "Contains special character not in the allowed set",
          valid: false,
          reason: "Special character used is not in the allowed set (#?!@$%^&*-)",
        },
        {
          password: "NOLOWERNONUMBER!",
          description: "Missing lowercase letter and number",
          valid: false,
          reason: "Does not contain lowercase letter and number",
        },
        {
          password: "nouppernospecial123",
          description: "Missing uppercase letter and special character",
          valid: false,
          reason: "Does not contain uppercase letter and special character",
        },
        {
          password: "          12A!",
          description: "Mostly whitespace with minimal valid characters",
          valid: false,
          reason:
            "Although it contains all required character types, the spaces don't count towards the 12 character minimum",
        },
        {
          password: "Password123",
          description: "Common password format missing special character",
          valid: false,
          reason: "Does not contain special character",
        },
      ].map((entry) =>
        Object.assign(entry, {
          toString: function () {
            return this.description
          },
        })
      )

      it.each(TEST_PASSWORDS)("%s", async (entry) => {
        const { password, valid } = entry

        act(() => {
          renderCreateAccountPage()
        })

        const createAccountButton = screen.getByRole("button", { name: /create account/i })
        const passwordInput = screen.getByLabelText(/^password/i, { selector: "input" })
        expect(passwordInput).toBeInTheDocument()
        expect(createAccountButton).toBeInTheDocument()

        await act(() => userEvent.type(passwordInput, password))
        await act(() => userEvent.click(createAccountButton))

        if (valid) {
          await waitFor(() => {
            expect(screen.queryByText("Please enter a valid password")).not.toBeInTheDocument()
          })
          expect(passwordInput).toBeValid()
        } else {
          expect(await screen.findByText("Please enter a valid password")).toBeInTheDocument()
          expect(passwordInput).toBeInvalid()
        }
      })
    })

    it("show error on password on missmatching passwords", async () => {
      renderCreateAccountPage()

      const createAccountButton = screen.getByRole("button", { name: /create account/i })
      const passwordInput = screen.getByLabelText(/^password/i, { selector: "input" })
      const passwordConfirmInput = screen.getByLabelText(/re-enter your password/i, {
        selector: "input",
      })

      expect(passwordInput).toBeInTheDocument()
      expect(passwordConfirmInput).toBeInTheDocument()
      expect(createAccountButton).toBeInTheDocument()

      await userEvent.type(passwordInput, "P@ssw0rd#123")
      await userEvent.type(passwordConfirmInput, "Test")
      await userEvent.click(createAccountButton)

      expect(passwordInput).toBeValid()
      expect(passwordConfirmInput).toBeInvalid()
      expect(screen.queryByText("Please enter a valid password")).not.toBeInTheDocument()
      expect(await screen.findByText("The passwords do not match")).toBeInTheDocument()
    })
  })

  it("should navigate show confirm modal on account create", async () => {
    renderCreateAccountPage()

    expect(screen.getByRole("heading", { name: /create account/i, level: 1 })).toBeInTheDocument()
    await userEvent.type(screen.getByRole("textbox", { name: /first or given name/i }), "John")
    await userEvent.type(screen.getByRole("textbox", { name: /middle name/i }), "Admin")
    await userEvent.type(screen.getByRole("textbox", { name: /last or family name/i }), "Doe")

    await userEvent.type(screen.getByRole("textbox", { name: /month/i }), "2")
    await userEvent.type(screen.getByRole("textbox", { name: /day/i }), "4")
    await userEvent.type(screen.getByRole("textbox", { name: /year/i }), "2000")

    await userEvent.type(
      screen.getByRole("textbox", { name: /your email address/i }),
      "johndoe@example.com"
    )

    await act(() =>
      userEvent.type(screen.getByLabelText(/^password/i, { selector: "input" }), "P@ssw0rd#123")
    )
    await act(() =>
      userEvent.type(
        screen.getByLabelText(/re-enter your password/i, {
          selector: "input",
        }),
        "P@ssw0rd#123"
      )
    )

    const createAccountButton = screen.getByRole("button", { name: /create account/i })
    expect(createAccountButton).toBeInTheDocument()
    await act(() => userEvent.click(createAccountButton))

    expect(screen.queryByText("Please enter a First Name")).not.toBeInTheDocument()
    expect(screen.queryByText("Must not be more than 64 characters.")).not.toBeInTheDocument()
    expect(screen.queryByText("Please enter a Last Name")).not.toBeInTheDocument()
    expect(
      screen.queryByText("Please enter a valid Date of Birth, must be 18 or older")
    ).not.toBeInTheDocument()
    expect(screen.queryByText("Please enter a valid email address")).not.toBeInTheDocument()
    expect(screen.queryByText("Please enter a valid password")).not.toBeInTheDocument()
    expect(screen.queryByText("The passwords do not match")).not.toBeInTheDocument()

    await waitFor(() => {
      expect(createUserFn).toHaveBeenCalled()
    })
  })
})
