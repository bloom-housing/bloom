import React from "react"
import { render, fireEvent, waitFor, act } from "@testing-library/react"
import { useRouter } from "next/router"
import { MessageContext, AuthContext } from "@bloom-housing/shared-helpers"
import { User, UserService } from "../../../../shared-helpers/src/types/backend-swagger"
import { SignIn as SignInComponent } from "../../src/pages/sign-in"
import { Verify } from "../../src/pages/verify"

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

  it("shows success toast with user's first name on successful login", async () => {
    const mockUser = { firstName: "User", id: "user-123" }
    const mockLogin = jest.fn().mockResolvedValue(mockUser)
    const mockAddToast = jest.fn()
    const mockRouter = { query: {}, push: jest.fn() }
    ;(useRouter as jest.Mock).mockReturnValue(mockRouter)

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

    // Complete login
    fireEvent.change(getByLabelText("Email"), { target: { value: "user@example.com" } })
    fireEvent.change(getByLabelText("Password"), { target: { value: "password123" } })
    fireEvent.click(getByRole("button", { name: /sign in/i }))

    // Verify toast is shown with the correct message
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith(
        "user@example.com",
        "password123",
        undefined,
        undefined,
        undefined,
        undefined
      )
      expect(mockAddToast).toHaveBeenCalledWith("Welcome back, User!", {
        variant: "success",
      })
    })
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

  it("successfully redirects to verify page on passwordless code request", async () => {
    const mockRouter = {
      query: {},
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

    // Enter email and click "Get code" button
    fireEvent.change(getByLabelText("Email"), { target: { value: "user@example.com" } })
    fireEvent.click(getByRole("button", { name: "Get code to sign in" }))

    // Verify redirect to verify page with correct parameters
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

  it("logs in with password after clicking 'Use your password instead' button", async () => {
    const mockLogin = jest.fn().mockResolvedValue({ firstName: "User" })
    const mockAddToast = jest.fn()
    const mockRouter = { query: {}, push: jest.fn() }
    ;(useRouter as jest.Mock).mockReturnValue(mockRouter)

    const { getByRole, getByLabelText } = render(
      <AuthContext.Provider
        value={{
          initialStateLoaded: true,
          login: mockLogin,
        }}
      >
        <MessageContext.Provider value={{ ...TOAST_MESSAGE, addToast: mockAddToast }}>
          <SignInComponent />
        </MessageContext.Provider>
      </AuthContext.Provider>
    )

    fireEvent.click(getByRole("button", { name: "Use your password instead" }))

    fireEvent.change(getByLabelText("Email"), { target: { value: "user@example.com" } })
    fireEvent.change(getByLabelText("Password"), { target: { value: "password123" } })
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
      expect(mockAddToast).toHaveBeenCalledWith("Welcome back, User!", {
        variant: "success",
      })
      expect(mockRouter.push).toHaveBeenCalledWith({
        pathname: "/account/dashboard",
        query: {},
      })
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
    process.env.showPwdless = ""
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
    it("shows sign-in form", () => {
      const { getByText, getByLabelText, getByRole } = renderSignInWithMandatedAccounts()

      expect(getByText("Sign In", { selector: "h1" })).toBeInTheDocument()
      expect(getByLabelText("Email")).toBeInTheDocument()
      expect(getByLabelText("Password")).toBeInTheDocument()
      expect(getByRole("button", { name: /sign in/i })).toBeInTheDocument()
      expect(getByRole("link", { name: /forgot password/i })).toBeInTheDocument()

      expect(getByText("Don't have an account?", { selector: "h2" })).toBeInTheDocument()
      expect(getByRole("link", { name: /create account/i })).toBeInTheDocument()
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
        expect(mockAddToast).toHaveBeenCalledWith("Welcome back, Test!", {
          variant: "success",
        })
        expect(mockRouter.push).toHaveBeenCalledWith({
          pathname: "/applications/start/choose-language",
          query: { listingId: "listing-123" },
        })
      })
    })

    describe("Mobile view", () => {
      beforeEach(() => {
        // Mocking window inner width to simulate mobile viewport
        Object.defineProperty(window, "innerWidth", {
          writable: true,
          configurable: true,
          value: 375, // Mobile width
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
        act(() => {
          window.dispatchEvent(new Event("resize"))
        })
      })

      it("shows sign-in form with listing redirect parameters on mobile", () => {
        const { getByText, getByLabelText, getByRole } = renderSignInWithMandatedAccounts()

        expect(getByText("Sign In", { selector: "h1" })).toBeInTheDocument()
        expect(getByLabelText("Email")).toBeInTheDocument()
        expect(getByLabelText("Password")).toBeInTheDocument()
        expect(getByRole("button", { name: /sign in/i })).toBeInTheDocument()
        expect(getByRole("link", { name: /forgot password/i })).toBeInTheDocument()

        expect(getByText("Don't have an account?", { selector: "h2" })).toBeInTheDocument()
        expect(getByRole("link", { name: /create account/i })).toBeInTheDocument()
      })

      it("shows success toast after successful login with password", async () => {
        const mockLogin = jest.fn().mockResolvedValue({ firstName: "User" })
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
          expect(mockAddToast).toHaveBeenCalledWith("Welcome back, User!", {
            variant: "success",
          })
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
    process.env.showPwdless = ""
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

    expect(await findByText("Your account is not confirmed")).toBeInTheDocument()
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
    process.env.showPwdless = ""
  })

  afterEach(() => {
    process.env.showPwdless = originalShowPwdless
  })

  it("shows resend confirmation modal then closes it after successful resend on verify page", async () => {
    const mockUser = { firstName: "User", id: "user-123" }
    const mockLogin = jest.fn().mockResolvedValue(mockUser)
    const mockAddToast = jest.fn()
    const mockRouter = {
      query: {
        email: "user@example.com",
        flowType: "login",
      },
      push: jest.fn(),
    }
    ;(useRouter as jest.Mock).mockReturnValue(mockRouter)
    const mockRequestSingleUseCode = jest.fn().mockResolvedValue({})

    const { getByRole, findByText } = render(
      <AuthContext.Provider
        value={{
          initialStateLoaded: true,
          profile: undefined,
          login: mockLogin,
          requestSingleUseCode: mockRequestSingleUseCode,
        }}
      >
        <MessageContext.Provider value={{ ...TOAST_MESSAGE, addToast: mockAddToast }}>
          <Verify />
        </MessageContext.Provider>
      </AuthContext.Provider>
    )

    const resendButton = getByRole("button", { name: /resend/i })
    expect(resendButton).toBeInTheDocument()
    fireEvent.click(resendButton)

    expect(await findByText("Resend Code")).toBeInTheDocument()
    const resendCodeButton = await findByText("Resend Code")
    fireEvent.click(resendCodeButton)

    const resendCodeConfirmationButton = await findByText("Resend the code")
    expect(resendCodeConfirmationButton).toBeInTheDocument()

    expect(
      await findByText(
        "If there is an account made with user@example.com, we’ll send a new code. Be aware, the code will expire in 10 minutes."
      )
    ).toBeInTheDocument()

    fireEvent.click(resendCodeConfirmationButton)

    expect(
      await findByText(
        "A new code has been sent to user@example.com. Be aware, the code will expire in 10 minutes."
      )
    ).toBeInTheDocument()
    expect(mockRequestSingleUseCode).toHaveBeenCalledWith("user@example.com")
  })

  it("correctly calls resendConfirmation when clicking resend button", async () => {
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
    const mockResendConfirmation = jest.fn().mockResolvedValue({})

    const { getByLabelText, getByRole, findByText } = render(
      <AuthContext.Provider
        value={{
          initialStateLoaded: true,
          profile: undefined,
          login: mockLogin,
          userService: {
            resendConfirmation: mockResendConfirmation,
          } as unknown as UserService,
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
    const modalHeader = await findByText("Your account is not confirmed")
    expect(modalHeader).toBeInTheDocument()

    // Find and click the resend email button
    const resendButton = await findByText("Resend the email")
    fireEvent.click(resendButton)

    await waitFor(() => {
      expect(mockResendConfirmation).toHaveBeenCalledWith({
        body: expect.objectContaining({
          email: "user@example.com",
          appUrl: window.location.origin,
        }),
      })
    })
  })
})
