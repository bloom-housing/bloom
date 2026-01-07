import React from "react"
import { render, fireEvent, waitFor } from "@testing-library/react"
import { useRouter } from "next/router"
import { MessageContext, AuthContext } from "@bloom-housing/shared-helpers"
import { UserService, MfaType } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import SignIn from "../../src/pages/sign-in"

const TOAST_MESSAGE = {
  toastMessagesRef: { current: [] },
  addToast: jest.fn(),
}

const mockDoJurisdictionsHaveFeatureFlagOn = jest.fn().mockReturnValue(true)

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}))

jest.mock("react-google-recaptcha-v3", () => ({
  GoogleReCaptcha: () => null,
}))

beforeAll(() => {
  window.scrollTo = jest.fn()
  process.env.showSmsMfa = "TRUE"
})

describe("Partners Sign In Page", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue({
      query: {},
      push: jest.fn(),
    })
  })

  describe("Form rendering tests", () => {
    it("renders email and password form with all elements", () => {
      const { getByLabelText, getByRole, getByText } = render(
        <AuthContext.Provider
          value={{
            initialStateLoaded: true,
            profile: undefined,
            doJurisdictionsHaveFeatureFlagOn: mockDoJurisdictionsHaveFeatureFlagOn,
          }}
        >
          <MessageContext.Provider value={TOAST_MESSAGE}>
            <SignIn />
          </MessageContext.Provider>
        </AuthContext.Provider>
      )

      expect(getByText("Sign in", { selector: "h1" })).toBeInTheDocument()
      expect(getByLabelText("Email")).toBeInTheDocument()
      expect(getByLabelText("Password")).toBeInTheDocument()
      expect(getByRole("link", { name: /forgot password/i })).toBeInTheDocument()
      expect(getByRole("button", { name: /sign in/i })).toBeInTheDocument()
    })

    it("should not show validation errors on initial render", () => {
      const { queryByText } = render(
        <AuthContext.Provider
          value={{
            initialStateLoaded: true,
            profile: undefined,
            doJurisdictionsHaveFeatureFlagOn: mockDoJurisdictionsHaveFeatureFlagOn,
          }}
        >
          <MessageContext.Provider value={TOAST_MESSAGE}>
            <SignIn />
          </MessageContext.Provider>
        </AuthContext.Provider>
      )

      expect(
        queryByText("There are errors you'll need to resolve before moving on.")
      ).not.toBeInTheDocument()
      expect(queryByText("Please enter your login email")).not.toBeInTheDocument()
      expect(queryByText("Please enter your login password")).not.toBeInTheDocument()
    })
  })

  describe("Email and password login", () => {
    it("successfully logs in with valid email and password", async () => {
      const mockLogin = jest.fn().mockResolvedValue({ firstName: "Partner", id: "user-123" })
      const mockRouter = { query: {}, push: jest.fn() }
      ;(useRouter as jest.Mock).mockReturnValue(mockRouter)

      const { getByLabelText, getByRole } = render(
        <AuthContext.Provider
          value={{
            initialStateLoaded: true,
            profile: undefined,
            login: mockLogin,
            doJurisdictionsHaveFeatureFlagOn: mockDoJurisdictionsHaveFeatureFlagOn,
          }}
        >
          <MessageContext.Provider value={TOAST_MESSAGE}>
            <SignIn />
          </MessageContext.Provider>
        </AuthContext.Provider>
      )

      fireEvent.change(getByLabelText("Email"), { target: { value: "partner@example.com" } })
      fireEvent.change(getByLabelText("Password"), { target: { value: "password123" } })
      fireEvent.click(getByRole("button", { name: /sign in/i }))

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith(
          "partner@example.com",
          "password123",
          undefined,
          undefined,
          true,
          undefined
        )
        expect(mockRouter.push).toHaveBeenCalledWith("/")
      })
    })

    it("shows error when email is missing", async () => {
      const { getByLabelText, getByRole, findByText } = render(
        <AuthContext.Provider
          value={{
            initialStateLoaded: true,
            profile: undefined,
            doJurisdictionsHaveFeatureFlagOn: mockDoJurisdictionsHaveFeatureFlagOn,
          }}
        >
          <MessageContext.Provider value={TOAST_MESSAGE}>
            <SignIn />
          </MessageContext.Provider>
        </AuthContext.Provider>
      )

      fireEvent.change(getByLabelText("Password"), { target: { value: "password123" } })
      fireEvent.click(getByRole("button", { name: /sign in/i }))

      expect(
        await findByText("There are errors you'll need to resolve before moving on.")
      ).toBeInTheDocument()
      expect(await findByText("Please enter your login email")).toBeInTheDocument()
    })

    it("shows error when password is missing", async () => {
      const { getByLabelText, getByRole, findByText } = render(
        <AuthContext.Provider
          value={{
            initialStateLoaded: true,
            profile: undefined,
            doJurisdictionsHaveFeatureFlagOn: mockDoJurisdictionsHaveFeatureFlagOn,
          }}
        >
          <MessageContext.Provider value={TOAST_MESSAGE}>
            <SignIn />
          </MessageContext.Provider>
        </AuthContext.Provider>
      )

      fireEvent.change(getByLabelText("Email"), { target: { value: "partner@example.com" } })
      fireEvent.click(getByRole("button", { name: /sign in/i }))

      expect(
        await findByText("There are errors you'll need to resolve before moving on.")
      ).toBeInTheDocument()
      expect(await findByText("Please enter your login password")).toBeInTheDocument()
    })

    it("shows error when both email and password are missing", async () => {
      const { getByRole, findByText } = render(
        <AuthContext.Provider
          value={{
            initialStateLoaded: true,
            profile: undefined,
            doJurisdictionsHaveFeatureFlagOn: mockDoJurisdictionsHaveFeatureFlagOn,
          }}
        >
          <MessageContext.Provider value={TOAST_MESSAGE}>
            <SignIn />
          </MessageContext.Provider>
        </AuthContext.Provider>
      )

      fireEvent.click(getByRole("button", { name: /sign in/i }))

      expect(
        await findByText("There are errors you'll need to resolve before moving on.")
      ).toBeInTheDocument()
      expect(await findByText("Please enter your login email")).toBeInTheDocument()
      expect(await findByText("Please enter your login password")).toBeInTheDocument()
    })
  })

  describe("MFA flow tests", () => {
    it("progresses to MFA type selection when mfaCodeIsMissing error is returned", async () => {
      const mockError = {
        response: {
          status: 401,
          data: {
            name: "mfaCodeIsMissing",
            message: "MFA code is missing",
          },
        },
      }
      const mockLogin = jest.fn().mockRejectedValue(mockError)

      const { getByLabelText, getByRole, findByText } = render(
        <AuthContext.Provider
          value={{
            initialStateLoaded: true,
            profile: undefined,
            login: mockLogin,
            doJurisdictionsHaveFeatureFlagOn: mockDoJurisdictionsHaveFeatureFlagOn,
          }}
        >
          <MessageContext.Provider value={TOAST_MESSAGE}>
            <SignIn />
          </MessageContext.Provider>
        </AuthContext.Provider>
      )

      fireEvent.change(getByLabelText("Email"), { target: { value: "partner@example.com" } })
      fireEvent.change(getByLabelText("Password"), { target: { value: "password123" } })
      fireEvent.click(getByRole("button", { name: /sign in/i }))

      expect(
        await findByText(/how would you like us to verify that it's you?/i)
      ).toBeInTheDocument()
      expect(await findByText(/verify with email/i)).toBeInTheDocument()
    })

    it("completes MFA flow with email verification", async () => {
      const mockError = {
        response: {
          status: 401,
          data: {
            name: "mfaCodeIsMissing",
            message: "MFA code is missing",
          },
        },
      }
      const mockLogin = jest
        .fn()
        .mockRejectedValueOnce(mockError)
        .mockResolvedValueOnce({ firstName: "Partner" })
      const mockRequestMfaCode = jest.fn().mockResolvedValue({ phoneNumberVerified: true })
      const mockRouter = { query: {}, push: jest.fn() }
      ;(useRouter as jest.Mock).mockReturnValue(mockRouter)

      const { getByLabelText, getByRole, findByText, getByTestId } = render(
        <AuthContext.Provider
          value={{
            initialStateLoaded: true,
            profile: undefined,
            login: mockLogin,
            requestMfaCode: mockRequestMfaCode,
            doJurisdictionsHaveFeatureFlagOn: mockDoJurisdictionsHaveFeatureFlagOn,
          }}
        >
          <MessageContext.Provider value={TOAST_MESSAGE}>
            <SignIn />
          </MessageContext.Provider>
        </AuthContext.Provider>
      )

      fireEvent.change(getByLabelText("Email"), { target: { value: "partner@example.com" } })
      fireEvent.change(getByLabelText("Password"), { target: { value: "password123" } })
      fireEvent.click(getByRole("button", { name: /sign in/i }))

      expect(
        await findByText(/how would you like us to verify that it's you?/i)
      ).toBeInTheDocument()
      fireEvent.click(getByRole("button", { name: /verify with email/i }))

      await waitFor(() => {
        expect(mockRequestMfaCode).toHaveBeenCalledWith(
          "partner@example.com",
          "password123",
          MfaType.email
        )
      })

      expect(await findByText(/we sent a code to your email/i)).toBeInTheDocument()
      fireEvent.change(getByTestId("sign-in-mfa-code-field"), { target: { value: "123456" } })
      fireEvent.click(getByRole("button", { name: /sign in/i }))

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith(
          "partner@example.com",
          "password123",
          "123456",
          MfaType.email,
          true
        )
        expect(mockRouter.push).toHaveBeenCalledWith("/")
      })
    })
  })

  describe("Phone number addition flow tests", () => {
    it("prompts to add phone number when phoneNumberMissing error is returned", async () => {
      const mockError = {
        response: {
          status: 401,
          data: {
            name: "mfaCodeIsMissing",
            message: "MFA code is missing",
          },
        },
      }
      const mockLogin = jest.fn().mockRejectedValue(mockError)
      const mockRequestMfaCodeError = {
        response: {
          status: 400,
          data: {
            name: "phoneNumberMissing",
            message: "Phone number is missing",
          },
        },
      }
      const mockRequestMfaCode = jest.fn().mockRejectedValue(mockRequestMfaCodeError)

      const { getByLabelText, getByRole, findByText } = render(
        <AuthContext.Provider
          value={{
            initialStateLoaded: true,
            profile: undefined,
            login: mockLogin,
            requestMfaCode: mockRequestMfaCode,
            doJurisdictionsHaveFeatureFlagOn: mockDoJurisdictionsHaveFeatureFlagOn,
          }}
        >
          <MessageContext.Provider value={TOAST_MESSAGE}>
            <SignIn />
          </MessageContext.Provider>
        </AuthContext.Provider>
      )

      fireEvent.change(getByLabelText("Email"), { target: { value: "partner@example.com" } })
      fireEvent.change(getByLabelText("Password"), { target: { value: "password123" } })
      fireEvent.click(getByRole("button", { name: /sign in/i }))

      expect(
        await findByText(/how would you like us to verify that it's you?/i)
      ).toBeInTheDocument()

      const smsButton = getByRole("button", { name: /verify with phone number/i })
      if (smsButton) {
        fireEvent.click(smsButton)

        expect(await findByText(/add a phone number/i)).toBeInTheDocument()
      }
    })

    it("shows phone number prompt when phone number is missing for SMS MFA", async () => {
      const mockError = {
        response: {
          status: 401,
          data: {
            name: "mfaCodeIsMissing",
            message: "MFA code is missing",
          },
        },
      }
      const mockLogin = jest.fn().mockRejectedValue(mockError)
      const mockRequestMfaCodeError = {
        response: {
          status: 400,
          data: {
            name: "phoneNumberMissing",
            message: "Phone number is missing",
          },
        },
      }
      const mockRequestMfaCode = jest.fn().mockRejectedValue(mockRequestMfaCodeError)

      const { getByLabelText, getByRole, findByText } = render(
        <AuthContext.Provider
          value={{
            initialStateLoaded: true,
            profile: undefined,
            login: mockLogin,
            requestMfaCode: mockRequestMfaCode,
            doJurisdictionsHaveFeatureFlagOn: mockDoJurisdictionsHaveFeatureFlagOn,
          }}
        >
          <MessageContext.Provider value={TOAST_MESSAGE}>
            <SignIn />
          </MessageContext.Provider>
        </AuthContext.Provider>
      )

      fireEvent.change(getByLabelText("Email"), { target: { value: "partner@example.com" } })
      fireEvent.change(getByLabelText("Password"), { target: { value: "password123" } })
      fireEvent.click(getByRole("button", { name: /sign in/i }))

      expect(
        await findByText(/how would you like us to verify that it's you?/i)
      ).toBeInTheDocument()

      const smsButton = getByRole("button", { name: /verify with phone number/i })
      if (smsButton) {
        fireEvent.click(smsButton)

        expect(await findByText(/add a phone number/i)).toBeInTheDocument()
        expect(
          await findByText(/enter your phone number and we'll send you a code/i)
        ).toBeInTheDocument()
      }
    })

    it("allows editing phone number when phone number is not verified", async () => {
      const mockError = {
        response: {
          status: 401,
          data: {
            name: "mfaCodeIsMissing",
            message: "MFA code is missing",
          },
        },
      }
      const mockLogin = jest.fn().mockRejectedValue(mockError)
      const mockRequestMfaCode = jest.fn().mockResolvedValue({
        phoneNumberVerified: false,
        phoneNumber: "+14155559999",
      })

      const { getByLabelText, getByRole, findByText } = render(
        <AuthContext.Provider
          value={{
            initialStateLoaded: true,
            profile: undefined,
            login: mockLogin,
            requestMfaCode: mockRequestMfaCode,
            doJurisdictionsHaveFeatureFlagOn: mockDoJurisdictionsHaveFeatureFlagOn,
          }}
        >
          <MessageContext.Provider value={TOAST_MESSAGE}>
            <SignIn />
          </MessageContext.Provider>
        </AuthContext.Provider>
      )

      fireEvent.change(getByLabelText("Email"), { target: { value: "partner@example.com" } })
      fireEvent.change(getByLabelText("Password"), { target: { value: "password123" } })
      fireEvent.click(getByRole("button", { name: /sign in/i }))

      expect(
        await findByText(/how would you like us to verify that it's you?/i)
      ).toBeInTheDocument()

      const smsButton = getByRole("button", { name: /verify with phone number/i })
      if (smsButton) {
        fireEvent.click(smsButton)

        await waitFor(() => {
          expect(mockRequestMfaCode).toHaveBeenCalled()
        })

        expect(await findByText(/sent to/i)).toBeInTheDocument()
        expect(await findByText(/edit phone number/i)).toBeInTheDocument()
      }
    })
  })

  describe("Error flows tests", () => {
    it("shows error message when login fails with invalid credentials", async () => {
      const mockError = {
        response: {
          status: 401,
          data: {
            name: "unauthorized",
            message: "Invalid credentials",
          },
        },
      }
      const mockLogin = jest.fn().mockRejectedValue(mockError)

      const { getByLabelText, getByRole } = render(
        <AuthContext.Provider
          value={{
            initialStateLoaded: true,
            profile: undefined,
            login: mockLogin,
            doJurisdictionsHaveFeatureFlagOn: mockDoJurisdictionsHaveFeatureFlagOn,
          }}
        >
          <MessageContext.Provider value={TOAST_MESSAGE}>
            <SignIn />
          </MessageContext.Provider>
        </AuthContext.Provider>
      )

      fireEvent.change(getByLabelText("Email"), { target: { value: "partner@example.com" } })
      fireEvent.change(getByLabelText("Password"), { target: { value: "wrongpassword" } })
      fireEvent.click(getByRole("button", { name: /sign in/i }))

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalled()
      })
    })

    it("shows error when MFA code is invalid", async () => {
      const mockError = {
        response: {
          status: 401,
          data: {
            name: "mfaCodeIsMissing",
            message: "MFA code is missing",
          },
        },
      }
      const mockMfaError = {
        response: {
          status: 401,
          data: {
            name: "mfaCodeInvalid",
            message: "MFA code is invalid",
          },
        },
      }
      const mockLogin = jest
        .fn()
        .mockRejectedValueOnce(mockError)
        .mockRejectedValueOnce(mockMfaError)
      const mockRequestMfaCode = jest.fn().mockResolvedValue({ phoneNumberVerified: true })

      const { getByLabelText, getByRole, findByText, getByTestId } = render(
        <AuthContext.Provider
          value={{
            initialStateLoaded: true,
            profile: undefined,
            login: mockLogin,
            requestMfaCode: mockRequestMfaCode,
            doJurisdictionsHaveFeatureFlagOn: mockDoJurisdictionsHaveFeatureFlagOn,
          }}
        >
          <MessageContext.Provider value={TOAST_MESSAGE}>
            <SignIn />
          </MessageContext.Provider>
        </AuthContext.Provider>
      )

      fireEvent.change(getByLabelText("Email"), { target: { value: "partner@example.com" } })
      fireEvent.change(getByLabelText("Password"), { target: { value: "password123" } })
      fireEvent.click(getByRole("button", { name: /sign in/i }))

      expect(
        await findByText(/how would you like us to verify that it's you?/i)
      ).toBeInTheDocument()
      fireEvent.click(getByRole("button", { name: /verify with email/i }))

      expect(await findByText(/we sent a code to your email/i)).toBeInTheDocument()
      fireEvent.change(getByTestId("sign-in-mfa-code-field"), { target: { value: "000000" } })
      fireEvent.click(getByRole("button", { name: /sign in/i }))

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledTimes(2)
      })
    })

    it("Shows error when MFA code field is empty", async () => {
      const mockError = {
        response: {
          status: 401,
          data: {
            name: "mfaCodeIsMissing",
            message: "MFA code is missing",
          },
        },
      }
      const mockLogin = jest.fn().mockRejectedValue(mockError)
      const mockRequestMfaCode = jest.fn().mockResolvedValue({ phoneNumberVerified: true })

      const { getByLabelText, getByRole, findByText } = render(
        <AuthContext.Provider
          value={{
            initialStateLoaded: true,
            profile: undefined,
            login: mockLogin,
            requestMfaCode: mockRequestMfaCode,
            doJurisdictionsHaveFeatureFlagOn: mockDoJurisdictionsHaveFeatureFlagOn,
          }}
        >
          <MessageContext.Provider value={TOAST_MESSAGE}>
            <SignIn />
          </MessageContext.Provider>
        </AuthContext.Provider>
      )

      fireEvent.change(getByLabelText("Email"), { target: { value: "partner@example.com" } })
      fireEvent.change(getByLabelText("Password"), { target: { value: "password123" } })
      fireEvent.click(getByRole("button", { name: /sign in/i }))

      expect(
        await findByText(/how would you like us to verify that it's you?/i)
      ).toBeInTheDocument()
      fireEvent.click(getByRole("button", { name: /verify with email/i }))

      expect(await findByText(/we sent a code to your email/i)).toBeInTheDocument()
      fireEvent.click(getByRole("button", { name: /sign in/i }))

      expect(await findByText(/please enter your code/i)).toBeInTheDocument()
    })
  })

  describe("Resend confirmation modal tests", () => {
    it("shows resend confirmation modal when account is not confirmed", async () => {
      const mockError = {
        response: {
          status: 401,
          data: {
            message: "accountConfirmed",
          },
        },
      }
      const mockLogin = jest.fn().mockRejectedValue(mockError)

      const { getByLabelText, getByRole, findByText } = render(
        <AuthContext.Provider
          value={{
            initialStateLoaded: true,
            profile: undefined,
            login: mockLogin,
            doJurisdictionsHaveFeatureFlagOn: mockDoJurisdictionsHaveFeatureFlagOn,
          }}
        >
          <MessageContext.Provider value={TOAST_MESSAGE}>
            <SignIn />
          </MessageContext.Provider>
        </AuthContext.Provider>
      )

      fireEvent.change(getByLabelText("Email"), { target: { value: "partner@example.com" } })
      fireEvent.change(getByLabelText("Password"), { target: { value: "password123" } })
      fireEvent.click(getByRole("button", { name: /sign in/i }))

      expect(await findByText(/your account is not confirmed/i)).toBeInTheDocument()
      expect(await findByText(/resend the email/i)).toBeInTheDocument()
    })

    it("successfully resends confirmation email", async () => {
      const mockError = {
        response: {
          status: 401,
          data: {
            message: "accountConfirmed",
          },
        },
      }
      const mockLogin = jest.fn().mockRejectedValue(mockError)
      const mockResendPartnerConfirmation = jest.fn().mockResolvedValue({})

      const { getByLabelText, getByRole, findByText } = render(
        <AuthContext.Provider
          value={{
            initialStateLoaded: true,
            profile: undefined,
            login: mockLogin,
            userService: {
              resendPartnerConfirmation: mockResendPartnerConfirmation,
            } as unknown as UserService,
            doJurisdictionsHaveFeatureFlagOn: mockDoJurisdictionsHaveFeatureFlagOn,
          }}
        >
          <MessageContext.Provider value={TOAST_MESSAGE}>
            <SignIn />
          </MessageContext.Provider>
        </AuthContext.Provider>
      )

      fireEvent.change(getByLabelText("Email"), { target: { value: "partner@example.com" } })
      fireEvent.change(getByLabelText("Password"), { target: { value: "password123" } })
      fireEvent.click(getByRole("button", { name: /sign in/i }))

      expect(await findByText(/your account is not confirmed/i)).toBeInTheDocument()

      const resendButton = await findByText(/resend the email/i)
      fireEvent.click(resendButton)

      await waitFor(() => {
        expect(mockResendPartnerConfirmation).toHaveBeenCalledWith({
          body: expect.objectContaining({
            email: "partner@example.com",
            appUrl: window.location.origin,
          }),
        })
      })

      expect(await findByText(/confirmation email has been sent/i)).toBeInTheDocument()
    })

    it("closes resend confirmation modal when cancel button is clicked", async () => {
      const mockError = {
        response: {
          status: 401,
          data: {
            message: "accountConfirmed",
          },
        },
      }
      const mockLogin = jest.fn().mockRejectedValue(mockError)

      const { getByLabelText, getByRole, findByText, queryByText } = render(
        <AuthContext.Provider
          value={{
            initialStateLoaded: true,
            profile: undefined,
            login: mockLogin,
            doJurisdictionsHaveFeatureFlagOn: mockDoJurisdictionsHaveFeatureFlagOn,
          }}
        >
          <MessageContext.Provider value={TOAST_MESSAGE}>
            <SignIn />
          </MessageContext.Provider>
        </AuthContext.Provider>
      )

      fireEvent.change(getByLabelText("Email"), { target: { value: "partner@example.com" } })
      fireEvent.change(getByLabelText("Password"), { target: { value: "password123" } })
      fireEvent.click(getByRole("button", { name: /sign in/i }))

      expect(await findByText(/your account is not confirmed/i)).toBeInTheDocument()

      const cancelButton = getByRole("button", { name: /cancel/i })
      fireEvent.click(cancelButton)

      await waitFor(() => {
        expect(queryByText(/your account is not confirmed/i)).not.toBeInTheDocument()
      })
    })
  })
})
