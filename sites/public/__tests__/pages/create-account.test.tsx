import { AuthContext } from "@bloom-housing/shared-helpers"
import { fireEvent, mockNextRouter, render, waitFor } from "../testUtils"
import { user } from "@bloom-housing/shared-helpers/__tests__/testHelpers"
import React from "react"
import CreateAccount from "../../src/pages/create-account"

beforeAll(() => {
  mockNextRouter()
  window.scrollTo = jest.fn()
})

const renderCreateAccountPage = () =>
  render(
    <AuthContext.Provider
      value={{
        profile: {
          ...user,
          listings: [],
          jurisdictions: [],
        },
      }}
    >
      <CreateAccount />
    </AuthContext.Provider>
  )

describe("Create Account Page", () => {
  it("should render the page with all fileds, buttons and links", () => {
    const { getByLabelText, getByText } = renderCreateAccountPage()

    expect(getByText("Create Account", { selector: "h1" })).toBeInTheDocument()
    expect(getByLabelText("Your Name")).toBeInTheDocument()
    expect(getByLabelText("First or Given Name")).toBeInTheDocument()
    expect(getByLabelText("Middle name (optional)")).toBeInTheDocument()
    expect(getByLabelText("Last or Family Name")).toBeInTheDocument()
    expect(getByText("Your date of birth")).toBeInTheDocument()
    expect(getByLabelText("Month")).toBeInTheDocument()
    expect(getByLabelText("Day")).toBeInTheDocument()
    expect(getByLabelText("Year")).toBeInTheDocument()
    expect(
      getByText("This is collected to verify that you are at least 18 years old.")
    ).toBeInTheDocument()
    expect(getByText("For example: 01 19 2000")).toBeInTheDocument()
    expect(getByLabelText("Your Email Address")).toBeInTheDocument()
    expect(getByLabelText("Password")).toBeInTheDocument()
    expect(
      getByText(
        "Must be at least 12 characters and include at least one lowercase letter, one uppercase letter, one number, and one special character (#?!@$%^&*-)."
      )
    ).toBeInTheDocument()
    expect(getByLabelText("Re-enter your password")).toBeInTheDocument()
    expect(getByText("Create Account", { selector: "button" }))
    expect(getByText("Already have an account?", { selector: "h2" })).toBeInTheDocument()
    const signInlink = getByText("Sign In", { selector: "a" })
    expect(signInlink).toBeInTheDocument()
    expect(signInlink).toHaveAttribute("href", "/sign-in")
  })

  describe("Field validation errors", () => {
    it("should show no alerts on initial load", () => {
      const { queryByText } = renderCreateAccountPage()

      expect(queryByText("Please enter a First Name")).not.toBeInTheDocument()
      expect(queryByText("Must not be more than 64 characters.")).not.toBeInTheDocument()
      expect(queryByText("Please enter a Last Name")).not.toBeInTheDocument()
      expect(
        queryByText("Please enter a valid Date of Birth, must be 18 or older")
      ).not.toBeInTheDocument()
      expect(queryByText("Please enter a valid email address")).not.toBeInTheDocument()
      expect(queryByText("Please enter a valid password")).not.toBeInTheDocument()
      expect(queryByText("The passwords do not match")).not.toBeInTheDocument()
    })

    it("show alerts on 'Create Account' click without filling any fields", async () => {
      const { findByText, getByText, queryByText } = renderCreateAccountPage()

      const createAccountButton = getByText("Create Account", { selector: "button" })
      expect(createAccountButton).toBeInTheDocument()
      fireEvent.click(createAccountButton)

      expect(await findByText("Please enter a First Name")).toBeInTheDocument()
      expect(getByText("Please enter a Last Name")).toBeInTheDocument()
      expect(
        getByText("Please enter a valid Date of Birth, must be 18 or older")
      ).toBeInTheDocument()
      expect(getByText("Please enter a valid email address")).toBeInTheDocument()
      expect(getByText("Please enter a valid password")).toBeInTheDocument()

      expect(queryByText("Must not be more than 64 characters.")).not.toBeInTheDocument()
      expect(queryByText("The passwords do not match")).not.toBeInTheDocument()
    })

    it("show max character limit error for string fields", async () => {
      const { getByLabelText, findAllByText, getByText, queryByText } = renderCreateAccountPage()

      const createAccountButton = getByText("Create Account", { selector: "button" })
      const firstNameField = getByLabelText("First or Given Name")
      const middleNameField = getByLabelText("Middle name (optional)")
      const lastNameField = getByLabelText("Last or Family Name")

      expect(firstNameField).toBeInTheDocument()
      expect(middleNameField).toBeInTheDocument()
      expect(lastNameField).toBeInTheDocument()
      expect(createAccountButton).toBeInTheDocument()
      fireEvent.change(firstNameField, { target: { value: Array(65).fill("a").join("") } })
      fireEvent.change(middleNameField, { target: { value: Array(65).fill("a").join("") } })
      fireEvent.change(lastNameField, { target: { value: Array(65).fill("a").join("") } })
      fireEvent.click(createAccountButton)
      expect(await findAllByText("Must not be more than 64 characters.")).toHaveLength(3)
      expect(queryByText("Please enter a First Name")).not.toBeInTheDocument()
      expect(queryByText("Please enter a Last Name")).not.toBeInTheDocument()
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

        const { getByText, getByLabelText, queryByText, findByText } = renderCreateAccountPage()

        const createAccountButton = getByText("Create Account", { selector: "button" })
        const passwordField = getByLabelText("Password")
        expect(passwordField).toBeInTheDocument()
        expect(createAccountButton).toBeInTheDocument()

        await waitFor(() => {
          fireEvent.change(passwordField, { target: { value: password } })
        })
        fireEvent.click(createAccountButton)

        if (valid) {
          expect(queryByText("Please enter a valid password")).not.toBeInTheDocument()
        } else {
          expect(await findByText("Please enter a valid password")).toBeInTheDocument()
        }
      })
    })

    it("show error on password on missmatching passwords", async () => {
      const { getByLabelText, findByText, getByText, queryByText } = renderCreateAccountPage()

      const createAccountButton = getByText("Create Account", { selector: "button" })
      const passwordField = getByLabelText("Password")
      const repeatPasswordField = getByLabelText("Re-enter your password")
      expect(passwordField).toBeInTheDocument()
      expect(repeatPasswordField).toBeInTheDocument()
      expect(createAccountButton).toBeInTheDocument()

      fireEvent.change(passwordField, { target: { value: "P@ssw0rd#123" } })
      fireEvent.change(repeatPasswordField, { target: { value: "Test" } })
      fireEvent.click(createAccountButton)

      expect(queryByText("Please enter a valid password")).not.toBeInTheDocument()
      expect(await findByText("The passwords do not match")).toBeInTheDocument()
    })
  })

  it("should navigate show confirm modal on account create", async () => {
    const { getByLabelText, getByText, queryByText, getByTestId } = renderCreateAccountPage()

    fireEvent.change(getByLabelText("First or Given Name"), { target: { value: "John" } })
    fireEvent.change(getByLabelText("Middle name (optional)"), { target: { value: "Admin" } })
    fireEvent.change(getByLabelText("Last or Family Name"), { target: { value: "Doe" } })
    fireEvent.change(getByTestId("dob-field-month"), { target: { value: "2" } })
    fireEvent.change(getByTestId("dob-field-day"), { target: { value: "2" } })
    fireEvent.change(getByTestId("dob-field-year"), { target: { value: "2000" } })
    fireEvent.change(getByLabelText("Your Email Address"), {
      target: { value: "test@example.com" },
    })
    fireEvent.change(getByLabelText("Password"), { target: { value: "P@ssw0rd#123" } })
    fireEvent.change(getByLabelText("Re-enter your password"), {
      target: { value: "P@ssw0rd#123" },
    })

    const createAccountButton = getByText("Create Account", { selector: "button" })
    expect(createAccountButton).toBeInTheDocument()

    await waitFor(() => fireEvent.click(createAccountButton))

    expect(queryByText("Please enter a First Name")).not.toBeInTheDocument()
    expect(queryByText("Must not be more than 64 characters.")).not.toBeInTheDocument()
    expect(queryByText("Please enter a Last Name")).not.toBeInTheDocument()
    expect(
      queryByText("Please enter a valid Date of Birth, must be 18 or older")
    ).not.toBeInTheDocument()
    expect(queryByText("Please enter a valid email address")).not.toBeInTheDocument()
    expect(queryByText("Please enter a valid password")).not.toBeInTheDocument()
    expect(queryByText("The passwords do not match")).not.toBeInTheDocument()

    // expect(await findByText("Confirmation needed")).toBeInTheDocument()
    // expect(await findByText("An email has been sent to test@example.com")).toBeInTheDocument()
    // expect(
    //   await findByText(
    //     "Please click on the link in the email we sent you in order to complete account creation."
    //   )
    // ).toBeInTheDocument()
    // expect(await findByText("Resend the email", { selector: "button" })).toBeInTheDocument()
  })
})
