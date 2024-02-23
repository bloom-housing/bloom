import React from "react"
import { render } from "@testing-library/react"
import { RequireLogin } from "../src/auth/RequireLogin"
import { AuthContext } from "../src/auth/AuthContext"
import { GenericRouter, NavigationContext } from "@bloom-housing/ui-components"
import { User } from "../src/types/backend-swagger"

// Helpers

const mockRouter: GenericRouter = {
  pathname: "",
  asPath: "",
  back: jest.fn(),
  push(url: string) {
    this.pathname = url
    this.asPath = url
  },
}

const mockUser: User = {
  id: "123",
  email: "test@test.com",
  firstName: "Test",
  lastName: "User",
  dob: new Date("2020-01-01"),
  createdAt: new Date("2020-01-01"),
  updatedAt: new Date("2020-01-01"),
  jurisdictions: [],
  mfaEnabled: false,
  passwordUpdatedAt: new Date("2020-01-01"),
  passwordValidForDays: 180,
  agreedToTermsOfService: true,
  listings: [],
}

let initialStateLoaded = false
let profile: User | undefined
let props = {}

beforeEach(() => {
  mockRouter.push("")
})

const itShouldRender = () =>
  test("it renders successfully", () => {
    const { getByText } = render(
      <NavigationContext.Provider
        value={{
          router: mockRouter,
          LinkComponent: (props) => <a href={props.href}>{props.children}</a>,
        }}
      >
        <AuthContext.Provider value={{ initialStateLoaded, profile }}>
          <RequireLogin signInPath={"/sign-in"} signInMessage={"Test Sign-In Message"} {...props}>
            <div>child</div>
          </RequireLogin>
        </AuthContext.Provider>
      </NavigationContext.Provider>
    )
    expect(getByText("child")).toBeInTheDocument()
  })

const itShouldNotRenderChildren = () =>
  test("it should not render children", () => {
    const { queryByText } = render(
      <NavigationContext.Provider
        value={{
          router: mockRouter,
          LinkComponent: (props) => <a href={props.href}>{props.children}</a>,
        }}
      >
        <AuthContext.Provider value={{ initialStateLoaded, profile }}>
          <RequireLogin signInPath={"/sign-in"} signInMessage={"Test Sign-In Message"} {...props}>
            <div>child</div>
          </RequireLogin>
        </AuthContext.Provider>
      </NavigationContext.Provider>
    )
    expect(queryByText("child")).toBeFalsy()
  })

const itShouldRedirect = () =>
  test("it should redirect", () => {
    render(
      <NavigationContext.Provider
        value={{
          router: mockRouter,
          LinkComponent: (props) => <a href={props.href}>{props.children}</a>,
        }}
      >
        <AuthContext.Provider value={{ initialStateLoaded, profile }}>
          <RequireLogin signInPath={"/sign-in"} signInMessage={"Test Sign-In Message"} {...props}>
            <div id="child" />
          </RequireLogin>
        </AuthContext.Provider>
      </NavigationContext.Provider>
    )
    expect(mockRouter.pathname).toEqual("/sign-in")
  })

const itShouldNotRedirect = () =>
  test("it should not redirect", () => {
    render(
      <NavigationContext.Provider
        value={{
          router: mockRouter,
          LinkComponent: (props) => <a href={props.href}>{props.children}</a>,
        }}
      >
        <AuthContext.Provider value={{ initialStateLoaded, profile }}>
          <RequireLogin signInPath={"/sign-in"} signInMessage={"Test Sign-In Message"} {...props}>
            <div id="child" />
          </RequireLogin>
        </AuthContext.Provider>
      </NavigationContext.Provider>
    )
    expect(mockRouter.pathname).not.toEqual("/sign-in")
  })

const itShouldWaitForAuthState = () =>
  describe("Before the user state has loaded", () => {
    beforeEach(() => {
      initialStateLoaded = false
      profile = undefined
    })
    itShouldNotRenderChildren()
    itShouldNotRedirect()
  })

const itShouldRenderImmediately = () =>
  describe("Before the user state has loaded", () => {
    beforeEach(() => {
      initialStateLoaded = false
      profile = undefined
    })
    itShouldRender()
    itShouldNotRedirect()
  })

const itShouldVerifyLoginState = () =>
  describe("After user state has loaded", () => {
    beforeEach(() => {
      initialStateLoaded = true
    })

    describe("With a logged in user", () => {
      beforeEach(() => {
        profile = mockUser
      })
      itShouldRender()
      itShouldNotRedirect()
    })

    describe("Without a logged in user", () => {
      beforeEach(() => {
        profile = undefined
      })
      itShouldNotRenderChildren()
      itShouldRedirect()
    })
  })

const itShouldIgnoreLoggedInState = () =>
  describe("After user state has loaded", () => {
    beforeEach(() => {
      initialStateLoaded = true
    })

    describe("Without a logged in user", () => {
      beforeEach(() => {
        profile = undefined
      })
      itShouldRender()
      itShouldNotRedirect()
    })
  })

// Tests

describe("Without any paths specified", () => {
  itShouldWaitForAuthState()
  itShouldVerifyLoginState()
})

describe("With a list of paths to require login for", () => {
  beforeEach(() => {
    props = { requireForRoutes: ["/login-required"] }
  })

  describe("for a path that is not on the list", () => {
    beforeEach(() => {
      mockRouter.push("/allowed")
    })
    itShouldRenderImmediately()
    itShouldIgnoreLoggedInState()
  })

  describe("for a path that matches the list", () => {
    beforeEach(() => {
      mockRouter.push("/login-required")
    })
    itShouldWaitForAuthState()
    itShouldVerifyLoginState()
  })
})

describe("With a list of paths to bypass login", () => {
  beforeEach(() => {
    props = { skipForRoutes: ["/not-required"] }
  })

  describe("for a path that is not on the list", () => {
    beforeEach(() => {
      mockRouter.push("/not-allowed")
    })
    itShouldWaitForAuthState()
    itShouldVerifyLoginState()
  })

  describe("for a path that matches the list", () => {
    beforeEach(() => {
      mockRouter.push("/not-required")
    })
    itShouldRenderImmediately()
    itShouldIgnoreLoggedInState()
  })
})
