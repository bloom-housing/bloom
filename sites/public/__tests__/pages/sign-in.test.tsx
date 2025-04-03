import React from "react"
import { render, fireEvent, waitFor } from "@testing-library/react"
import { useRouter } from "next/router"
import { MessageContext, AuthContext } from "@bloom-housing/shared-helpers"
import { User } from "../../../../shared-helpers/src/types/backend-swagger"
import { SignIn as SignInComponent } from "../../src/pages/sign-in"

const initialStateLoaded = false
let profile: User | undefined

let originalShowPwdless

const TOAST_MESSAGE = {
  toastMessagesRef: { current: [] },
  addToast: jest.fn(),
}

const renderSignInPage = () =>
  render(
    <MessageContext.Provider value={TOAST_MESSAGE}>
      <SignInComponent />
    </MessageContext.Provider>
  )

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}))

beforeAll(() => {
  window.scrollTo = jest.fn()
})

describe("Sign In Page", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue("")
  })

  it("renders all page elements including fields, buttons and links", () => {
    const { getByText, getByTestId, getByLabelText, getByRole } = renderSignInPage()

    expect(getByText("Sign In", { selector: "h1" })).toBeInTheDocument()
    expect(getByLabelText("Email")).toBeInTheDocument()
    expect(getByTestId("sign-in-email-field")).toBeInTheDocument()
    expect(getByLabelText("Password")).toBeInTheDocument()
    expect(getByTestId("sign-in-password-field")).toBeInTheDocument()
    expect(getByRole("link", { name: /forgot password/i })).toBeInTheDocument()
    expect(getByRole("button", { name: /sign in/i })).toBeInTheDocument()

    expect(getByText("Don't have an account?", { selector: "h2" })).toBeInTheDocument()
    expect(getByRole("link", { name: /create account/i })).toBeInTheDocument()
  })

  describe("Field validation errors", () => {
    it("show error alert and password validation error when clicking 'Sign in' button without filling out password", async () => {
      const { findByText, getByRole, getByLabelText } = renderSignInPage()

      fireEvent.change(getByLabelText("Email"), { target: { value: "admin@example.com" } })

      fireEvent.click(getByRole("button", { name: /sign in/i }))
      expect(
        await findByText("There are errors you'll need to resolve before moving on.")
      ).toBeInTheDocument()
      expect(await findByText("Please enter your login password")).toBeInTheDocument()
    })

    it("shows error alert and  email validation error when clicking 'Sign in' button without filling out email address", async () => {
      const { findByText, getByRole, getByLabelText } = renderSignInPage()

      fireEvent.change(getByLabelText("Password"), { target: { value: "abcdef" } })

      fireEvent.click(getByRole("button", { name: /sign in/i }))
      expect(
        await findByText("There are errors you'll need to resolve before moving on.")
      ).toBeInTheDocument()
      expect(await findByText("Please enter your login email")).toBeInTheDocument()
    })

    it("shows error alert and both field validation errors when clicking 'Sign in' button without filling out fields", async () => {
      const { findByText, getByRole } = renderSignInPage()

      fireEvent.click(getByRole("button", { name: /sign in/i }))
      expect(
        await findByText("There are errors you'll need to resolve before moving on.")
      ).toBeInTheDocument()
      expect(await findByText("Please enter your login email")).toBeInTheDocument()
      expect(await findByText("Please enter your login password")).toBeInTheDocument()
    })

    it("should not show errors on render", () => {
      const { queryByText } = renderSignInPage()

      expect(
        queryByText("There are errors you'll need to resolve before moving on.")
      ).not.toBeInTheDocument()
      expect(queryByText("Please enter your login email")).not.toBeInTheDocument()
      expect(queryByText("Please enter your login password")).not.toBeInTheDocument()
    })
  })

  describe("User not logged in", () => {
    it("shows the sign-in form", () => {
      const { getByLabelText, getByText } = render(
        <AuthContext.Provider value={{ initialStateLoaded, profile }}>
          <MessageContext.Provider value={TOAST_MESSAGE}>
            <SignInComponent />
          </MessageContext.Provider>
        </AuthContext.Provider>
      )
      expect(getByText("Sign In", { selector: "h1" })).toBeInTheDocument()
      expect(getByLabelText("Email")).toBeInTheDocument()
      expect(getByLabelText("Password")).toBeInTheDocument()
    })
  })
})

describe("Passwordless Sign In page", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue("")
  })

  const renderSignInPage = () =>
    render(
      <MessageContext.Provider value={TOAST_MESSAGE}>
        <SignInComponent />
      </MessageContext.Provider>
    )

  beforeEach(() => {
    originalShowPwdless = process.env.showPwdless
    process.env.showPwdless = "TRUE"
  })

  afterEach(() => {
    process.env.showPwdless = originalShowPwdless
  })

  it("renders all page elements including fields, buttons and links", () => {
    const { getByText, getByLabelText, getByTestId, getByRole } = renderSignInPage()

    expect(getByText("Sign In", { selector: "h1" })).toBeInTheDocument()
    expect(
      getByText("Enter your email and we'll send you a code to sign in.", { selector: "p" })
    ).toBeInTheDocument()
    expect(getByLabelText("Email")).toBeInTheDocument()
    expect(getByTestId("sign-in-email-field")).toBeInTheDocument()

    expect(getByRole("button", { name: "Get code to sign in" })).toBeInTheDocument()
    expect(getByRole("button", { name: "Use your password instead" })).toBeInTheDocument()

    expect(getByText("Don't have an account?", { selector: "h2" })).toBeInTheDocument()
    expect(
      getByText("Sign up quickly with no need to remember any passwords.", { selector: "div" })
    ).toBeInTheDocument()
    expect(getByRole("link", { name: /create account/i })).toBeInTheDocument()
  })

  it("shows error alert and email validation error after clicking 'Get code to sign in' button without filling out email field", async () => {
    const { findByText, getByRole } = renderSignInPage()

    fireEvent.click(getByRole("button", { name: "Get code to sign in" }))
    expect(
      await findByText("There are errors you'll need to resolve before moving on.")
    ).toBeInTheDocument()
    expect(await findByText("Please enter your login email")).toBeInTheDocument()
  })

  it("shows correct page elements after clicking 'Use your password instead' button", async () => {
    const { getByRole, getByLabelText, getByTestId } = renderSignInPage()

    fireEvent.click(getByRole("button", { name: "Use your password instead" }))

    await waitFor(() => {
      expect(getByLabelText("Email")).toBeInTheDocument()
      expect(getByTestId("sign-in-email-field")).toBeInTheDocument()
      expect(getByLabelText("Password")).toBeInTheDocument()
      expect(getByTestId("sign-in-password-field")).toBeInTheDocument()
      expect(getByRole("button", { name: "Get a code instead" })).toBeInTheDocument()
    })
  })

  it("shows correct page elements after clicking 'Use your password instead' button and then clicking 'Get a code instead' button", async () => {
    const { findByRole, getByRole, getByLabelText, getByTestId, queryByLabelText, queryByTestId } =
      renderSignInPage()

    fireEvent.click(getByRole("button", { name: "Use your password instead" }))
    expect(await findByRole("button", { name: "Get a code instead" })).toBeInTheDocument()

    fireEvent.click(getByRole("button", { name: "Get a code instead" }))

    await waitFor(() => {
      expect(getByLabelText("Email")).toBeInTheDocument()
      expect(getByTestId("sign-in-email-field")).toBeInTheDocument()
      expect(queryByLabelText("Password")).not.toBeInTheDocument()
      expect(queryByTestId("sign-in-password-field")).not.toBeInTheDocument()
      expect(getByRole("button", { name: "Use your password instead" })).toBeInTheDocument()
    })
  })
})

describe("Mandated accounts", () => {
  let originalShowMandatedAccounts
  let originalShowPwdless

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue({
      query: { listingId: "listing-123", redirectUrl: "/applications/start/choose-language" },
      push: jest.fn(),
    })

    originalShowMandatedAccounts = process.env.showMandatedAccounts
    originalShowPwdless = process.env.showPwdless
    process.env.showMandatedAccounts = "TRUE"
    process.env.showPwdless = "" // Make sure passwordless is not the default
  })

  afterEach(() => {
    process.env.showMandatedAccounts = originalShowMandatedAccounts
    process.env.showPwdless = originalShowPwdless
  })

  const renderSignInWithMandatedAccounts = () =>
    render(
      <MessageContext.Provider value={TOAST_MESSAGE}>
        <SignInComponent />
      </MessageContext.Provider>
    )

  describe("Desktop view", () => {
    it("shows sign-in form with listing redirect parameters", () => {
      const { getByText, getByLabelText, getByTestId, getByRole } =
        renderSignInWithMandatedAccounts()

      expect(getByText("Sign In", { selector: "h1" })).toBeInTheDocument()
      expect(getByLabelText("Email")).toBeInTheDocument()
      expect(getByTestId("sign-in-password-field")).toBeInTheDocument()
      expect(getByRole("button", { name: /sign in/i })).toBeInTheDocument()
    })

    it("preserves listing ID and redirect URL on successful sign-in", async () => {
      const mockRouter = {
        query: {
          listingId: "listing-123",
          redirectUrl: "/applications/start/choose-language",
        },
        push: jest.fn(),
      }
      ;(useRouter as jest.Mock).mockReturnValue(mockRouter)

      const mockLogin = jest.fn().mockResolvedValue({ firstName: "Test" })
      const { getByLabelText, getByTestId, getByRole } = render(
        <AuthContext.Provider
          value={{
            initialStateLoaded: true,
            profile: undefined,
            login: mockLogin,
          }}
        >
          <MessageContext.Provider value={TOAST_MESSAGE}>
            <SignInComponent />
          </MessageContext.Provider>
        </AuthContext.Provider>
      )

      fireEvent.change(getByLabelText("Email"), { target: { value: "user@example.com" } })
      fireEvent.change(getByTestId("sign-in-password-field"), { target: { value: "password123" } })
      fireEvent.click(getByRole("button", { name: /sign in/i }))

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith(
          "user@example.com",
          "password123",
          undefined,
          undefined,
          undefined,
          undefined
        )
        // Verify we're redirected to the original URL with the listing ID preserved
        expect(mockRouter.push).toHaveBeenCalled()
      })
    })

    it("redirects to application page with listing ID after successful sign-in", async () => {
      const mockRouter = {
        query: {
          listingId: "listing-123",
          redirectUrl: "/applications/start/choose-language",
        },
        push: jest.fn(),
      }
      ;(useRouter as jest.Mock).mockReturnValue(mockRouter)

      const mockUser = { firstName: "Test", id: "user-123" }
      const mockLogin = jest.fn().mockResolvedValue(mockUser)
      const mockAddToast = jest.fn()

      const { getByLabelText, getByTestId, getByRole } = render(
        <AuthContext.Provider
          value={{
            initialStateLoaded: true,
            profile: undefined,
            login: mockLogin,
          }}
        >
          <MessageContext.Provider value={{ ...TOAST_MESSAGE, addToast: mockAddToast }}>
            <SignInComponent />
          </MessageContext.Provider>
        </AuthContext.Provider>
      )

      fireEvent.change(getByLabelText("Email"), { target: { value: "user@example.com" } })
      fireEvent.change(getByTestId("sign-in-password-field"), { target: { value: "password123" } })
      fireEvent.click(getByRole("button", { name: /sign in/i }))

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalled()
        expect(mockAddToast).toHaveBeenCalledWith("Welcome back, Test!", {
          variant: "success",
        })
        expect(mockRouter.push).toHaveBeenCalled()
      })

      it("displays the benefits/marketing content with mandated accounts enabled", () => {
        const { getByText } = renderSignInWithMandatedAccounts()

        // Verify the marketing content shown when mandated accounts is enabled
        expect(getByText("Don't have an account?", { selector: "h2" })).toBeInTheDocument()
      })
    })

    describe("Mobile view", () => {
      beforeEach(() => {
        // Mocking window inner width to simulate mobile viewport
        Object.defineProperty(window, "innerWidth", {
          writable: true,
          configurable: true,
          value: 480, // Mobile width
        })

        // Trigger resize event to ensure components respond to the new size
        window.dispatchEvent(new Event("resize"))
      })

      afterEach(() => {
        // Reset window size
        Object.defineProperty(window, "innerWidth", {
          writable: true,
          configurable: true,
          value: 1024, // Desktop width
        })
        window.dispatchEvent(new Event("resize"))
      })

      it("shows sign-in form with listing redirect parameters on mobile", () => {
        const { getByText, getByLabelText, getByTestId, getByRole } =
          renderSignInWithMandatedAccounts()

        expect(getByText("Sign In", { selector: "h1" })).toBeInTheDocument()
        expect(getByLabelText("Email")).toBeInTheDocument()
        expect(getByTestId("sign-in-password-field")).toBeInTheDocument()
        expect(getByRole("button", { name: /sign in/i })).toBeInTheDocument()
      })

      it("displays mobile-specific UI for mandated accounts", () => {
        const { getByText } = renderSignInWithMandatedAccounts()

        // Verify mobile-specific UI elements
        expect(getByText("Don't have an account?", { selector: "h2" })).toBeInTheDocument()
      })
    })

    describe("Passwordless view", () => {
      beforeEach(() => {
        process.env.showPwdless = "TRUE"
      })

      it("shows passwordless option when enabled", async () => {
        const { getByText, getByRole } = renderSignInWithMandatedAccounts()

        await waitFor(() => {
          expect(
            getByText("Enter your email and we'll send you a code to sign in.")
          ).toBeInTheDocument()
          expect(getByRole("button", { name: "Get code to sign in" })).toBeInTheDocument()
          expect(getByRole("button", { name: "Use your password instead" })).toBeInTheDocument()
        })
      })

      it("preserves listing ID and redirect URL on successful passwordless sign-in request", async () => {
        const mockRouter = {
          query: {
            listingId: "listing-123",
            redirectUrl: "/applications/start/choose-language",
          },
          push: jest.fn(),
        }
        ;(useRouter as jest.Mock).mockReturnValue(mockRouter)

        const mockRequestSingleUseCode = jest.fn().mockResolvedValue({})
        const { getByLabelText, getByRole } = render(
          <AuthContext.Provider
            value={{
              initialStateLoaded: true,
              profile: undefined,
              requestSingleUseCode: mockRequestSingleUseCode,
            }}
          >
            <MessageContext.Provider value={TOAST_MESSAGE}>
              <SignInComponent />
            </MessageContext.Provider>
          </AuthContext.Provider>
        )

        fireEvent.change(getByLabelText("Email"), { target: { value: "user@example.com" } })
        fireEvent.click(getByRole("button", { name: "Get code to sign in" }))

        await waitFor(() => {
          expect(mockRequestSingleUseCode).toHaveBeenCalledWith("user@example.com")
          // Verify query parameters are passed to verify page
          expect(mockRouter.push).toHaveBeenCalledWith({
            pathname: "/verify",
            query: {
              email: "user@example.com",
              flowType: "login",
              redirectUrl: "/applications/start/choose-language",
              listingId: "listing-123",
            },
          })
        })
      })

      it("can switch to password view", async () => {
        const { getByRole, getByTestId } = renderSignInWithMandatedAccounts()

        // Click to switch from passwordless to password view
        fireEvent.click(getByRole("button", { name: "Use your password instead" }))

        await waitFor(() => {
          expect(getByTestId("sign-in-password-field")).toBeInTheDocument()
          expect(getByRole("button", { name: "Get a code instead" })).toBeInTheDocument()
        })
      })
    })

    describe("Integration with application flow", () => {
      it("correctly handles the application flow when redirected from listing page", async () => {
        // Simulate the user being redirected from a listing page to sign in
        const mockRouter = {
          query: {
            listingId: "listing-123",
            redirectUrl: "/applications/start/choose-language",
          },
          push: jest.fn(),
        }
        ;(useRouter as jest.Mock).mockReturnValue(mockRouter)

        const mockLogin = jest.fn().mockResolvedValue({ firstName: "Test" })
        const { getByLabelText, getByTestId, getByRole } = render(
          <AuthContext.Provider
            value={{
              initialStateLoaded: true,
              profile: undefined,
              login: mockLogin,
            }}
          >
            <MessageContext.Provider value={TOAST_MESSAGE}>
              <SignInComponent />
            </MessageContext.Provider>
          </AuthContext.Provider>
        )

        // Complete sign-in process
        fireEvent.change(getByLabelText("Email"), { target: { value: "user@example.com" } })
        fireEvent.change(getByTestId("sign-in-password-field"), {
          target: { value: "password123" },
        })
        fireEvent.click(getByRole("button", { name: /sign in/i }))

        // Verify redirection to the application page with listing ID preserved
        await waitFor(() => {
          expect(mockLogin).toHaveBeenCalled()
          expect(mockRouter.push).toHaveBeenCalled()
          // The implementation uses redirectToPage() which handles the redirection based on query parameters
        })
      })
    })
  })

  describe("User successfully types in password and toast appears", () => {
    let originalShowPwdless

    beforeEach(() => {
      jest.clearAllMocks()
      ;(useRouter as jest.Mock).mockReturnValue({
        query: {},
        push: jest.fn(),
      })

      originalShowPwdless = process.env.showPwdless
      process.env.showPwdless = "" // Explicitly disable passwordless login
    })

    afterEach(() => {
      process.env.showPwdless = originalShowPwdless
    })

    describe("Regular flow", () => {
      it("shows success toast on successful login", async () => {
        const mockLogin = jest.fn().mockResolvedValue({ firstName: "John" })
        const mockAddToast = jest.fn()

        const { getByLabelText, getByRole } = render(
          <AuthContext.Provider
            value={{
              initialStateLoaded: true,
              profile: undefined,
              login: mockLogin,
            }}
          >
            <MessageContext.Provider value={{ ...TOAST_MESSAGE, addToast: mockAddToast }}>
              <SignInComponent />
            </MessageContext.Provider>
          </AuthContext.Provider>
        )

        fireEvent.change(getByLabelText("Email"), { target: { value: "user@example.com" } })
        fireEvent.change(getByLabelText("Password"), { target: { value: "password123" } })
        fireEvent.click(getByRole("button", { name: /sign in/i }))

        await waitFor(() => {
          expect(mockLogin).toHaveBeenCalled()
          expect(mockAddToast).toHaveBeenCalledWith("Welcome back, John!", {
            variant: "success",
          })
        })
      })
    })

    describe("Passwordless flow", () => {
      let originalShowPwdless

      beforeEach(() => {
        originalShowPwdless = process.env.showPwdless
        process.env.showPwdless = "TRUE"
      })

      afterEach(() => {
        process.env.showPwdless = originalShowPwdless
      })

      it("shows success toast after successful login with password", async () => {
        const mockLogin = jest.fn().mockResolvedValue({ firstName: "Jane" })
        const mockAddToast = jest.fn()

        const { getByLabelText, getByRole } = render(
          <AuthContext.Provider
            value={{
              initialStateLoaded: true,
              profile: undefined,
              login: mockLogin,
            }}
          >
            <MessageContext.Provider value={{ ...TOAST_MESSAGE, addToast: mockAddToast }}>
              <SignInComponent />
            </MessageContext.Provider>
          </AuthContext.Provider>
        )

        // Switch to password view first
        fireEvent.click(getByRole("button", { name: "Use your password instead" }))

        await waitFor(() => {
          expect(getByLabelText("Password")).toBeInTheDocument()
        })

        // Fill in credentials and log in
        fireEvent.change(getByLabelText("Email"), { target: { value: "user@example.com" } })
        fireEvent.change(getByLabelText("Password"), { target: { value: "password123" } })
        fireEvent.click(getByRole("button", { name: /sign in/i }))

        await waitFor(() => {
          expect(mockLogin).toHaveBeenCalled()
          expect(mockAddToast).toHaveBeenCalledWith("Welcome back, Jane!", {
            variant: "success",
          })
        })
      })

      it("redirects to verify page on successful passwordless code request", async () => {
        const mockRouter = {
          query: {},
          push: jest.fn(),
        }
        ;(useRouter as jest.Mock).mockReturnValue(mockRouter)

        const mockRequestSingleUseCode = jest.fn().mockResolvedValue({})
        const mockAddToast = jest.fn()

        const { getByLabelText, getByRole } = render(
          <AuthContext.Provider
            value={{
              initialStateLoaded: true,
              profile: undefined,
              requestSingleUseCode: mockRequestSingleUseCode,
            }}
          >
            <MessageContext.Provider value={{ ...TOAST_MESSAGE, addToast: mockAddToast }}>
              <SignInComponent />
            </MessageContext.Provider>
          </AuthContext.Provider>
        )

        fireEvent.change(getByLabelText("Email"), { target: { value: "user@example.com" } })
        fireEvent.click(getByRole("button", { name: "Get code to sign in" }))

        await waitFor(() => {
          expect(mockRequestSingleUseCode).toHaveBeenCalledWith("user@example.com")
          expect(mockRouter.push).toHaveBeenCalledWith({
            pathname: "/verify",
            query: {
              email: "user@example.com",
              flowType: "login",
            },
          })
        })
      })
    })
  })

  describe("User is not confirmed flow", () => {
    let originalShowPwdless

    beforeEach(() => {
      jest.clearAllMocks()
      ;(useRouter as jest.Mock).mockReturnValue({
        query: {},
        push: jest.fn(),
      })

      originalShowPwdless = process.env.showPwdless
      process.env.showPwdless = "" // Explicitly disable passwordless login
    })

    afterEach(() => {
      process.env.showPwdless = originalShowPwdless
    })

    it("shows confirmation modal when login fails with 'not confirmed' error", async () => {
      // Mock login to throw an error with the "not confirmed" message
      const mockError = {
        response: {
          status: 401,
          data: {
            message: "Account with email user@example.com exists but is not confirmed",
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
          }}
        >
          <MessageContext.Provider value={TOAST_MESSAGE}>
            <SignInComponent />
          </MessageContext.Provider>
        </AuthContext.Provider>
      )

      fireEvent.change(getByLabelText("Email"), { target: { value: "user@example.com" } })
      fireEvent.change(getByLabelText("Password"), { target: { value: "password123" } })
      fireEvent.click(getByRole("button", { name: /sign in/i }))

      // Verify the confirmation modal appears
      expect(await findByText("Your account is not confirmed")).toBeInTheDocument()
      expect(await findByText("Resend an email to")).toBeInTheDocument()
    })
  })

  describe("Resend confirmation flow", () => {
    let originalShowPwdless

    beforeEach(() => {
      jest.clearAllMocks()
      ;(useRouter as jest.Mock).mockReturnValue({
        query: {},
        push: jest.fn(),
      })

      originalShowPwdless = process.env.showPwdless
      process.env.showPwdless = "" // Explicitly disable passwordless login
    })

    afterEach(() => {
      process.env.showPwdless = originalShowPwdless
    })

    it("successfully resends confirmation email and shows success message", async () => {
      // Mock login to throw an error with the "not confirmed" message
      const mockError = {
        response: {
          status: 401,
          data: {
            message: "Account with email user@example.com exists but is not confirmed",
          },
        },
      }
      const mockLogin = jest.fn().mockRejectedValue(mockError)

      // Mock useMutate for resendConfirmation
      const mockMutate = jest.fn().mockImplementation((callback, options) => {
        callback()
          .then(() => options?.onSuccess?.())
          .catch((err) => options?.onError?.(err))
        return Promise.resolve()
      })

      const { getByLabelText, getByRole, findByText } = render(
        <AuthContext.Provider
          value={{
            initialStateLoaded: true,
            profile: undefined,
            login: mockLogin,
            userService: {
              resendConfirmation: jest.fn().mockResolvedValue({ success: true }),
            } as any,
          }}
        >
          <MessageContext.Provider value={TOAST_MESSAGE}>
            <SignInComponent />
          </MessageContext.Provider>
        </AuthContext.Provider>
      )

      // Log in to trigger the error
      fireEvent.change(getByLabelText("Email"), { target: { value: "user@example.com" } })
      fireEvent.change(getByLabelText("Password"), { target: { value: "password123" } })
      fireEvent.click(getByRole("button", { name: /sign in/i }))

      // Verify the confirmation modal appears
      const resendEmailButton = await findByText("Resend the email")

      // Click the resend confirmation button
      fireEvent.click(resendEmailButton)

      // Verify modal is activated
      expect(await findByText("Resend an email to")).toBeInTheDocument()
    })

    it("shows error message when resend confirmation fails", async () => {
      // Mock login to throw an error with the "not confirmed" message
      const mockError = {
        response: {
          status: 401,
          data: {
            message: "Account with email user@example.com exists but is not confirmed",
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
            userService: {
              resendConfirmation: jest.fn().mockRejectedValue(new Error("Failed to send email")),
            } as any,
          }}
        >
          <MessageContext.Provider value={TOAST_MESSAGE}>
            <SignInComponent />
          </MessageContext.Provider>
        </AuthContext.Provider>
      )

      // Log in to trigger the error
      fireEvent.change(getByLabelText("Email"), { target: { value: "user@example.com" } })
      fireEvent.change(getByLabelText("Password"), { target: { value: "password123" } })
      fireEvent.click(getByRole("button", { name: /sign in/i }))

      // Verify the confirmation modal appears
      const resendEmailButton = await findByText("Resend the email")

      // Click the resend confirmation button
      fireEvent.click(resendEmailButton)

      // Verify modal is shown with correct content
      expect(await findByText("Resend an email to")).toBeInTheDocument()
    })
  })
})
