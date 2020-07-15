import React from "react"
import { mount } from "enzyme"
import { RequireLogin } from "../../src/authentication/RequireLogin"
import { UserContext } from "../../src/authentication/UserContext"
import { User } from "@bloom-housing/backend-core"

let mockPathname: string
const mockPush = jest.fn()
jest.mock("next/router", () => ({
  __esModule: true,
  useRouter: () => ({
    pathname: mockPathname,
    push: mockPush,
  }),
}))

const mockUser: User = {
  id: "123",
  email: "test@test.com",
  passwordHash: "123",
  firstName: "Test",
  lastName: "User",
  dob: new Date("2020-01-01"),
  createdAt: new Date("2020-01-01"),
  updatedAt: new Date("2020-01-01"),
  applications: [],
}

let initialStateLoaded = false
let profile: User | undefined
let props = {}

beforeEach(() => {
  mockPush.mockReset()
})

const renderComponent = () =>
  mount(
    <UserContext.Provider value={{ initialStateLoaded, profile }}>
      <RequireLogin signInPath={"/sign-in"} {...props}>
        <div id="child" />
      </RequireLogin>
    </UserContext.Provider>
  )

const itShouldRender = () =>
  test("it renders successfully", () => {
    const wrapper = renderComponent()
    expect(wrapper.find("div#child").exists()).toBe(true)
  })

const itShouldNotRenderChildren = () =>
  test("it should not render children", () => {
    const wrapper = renderComponent()
    expect(wrapper.find("div#child").exists()).toBe(false)
  })

const itShouldRedirect = () =>
  test("it should redirect", () => {
    renderComponent()
    expect(mockPush).toHaveBeenCalledWith("/sign-in")
  })

const itShouldNotRedirect = () =>
  test("it should not redirect", () => {
    renderComponent()
    expect(mockPush).not.toHaveBeenCalled()
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
      mockPathname = "/allowed"
    })
    itShouldRenderImmediately()
    itShouldIgnoreLoggedInState()
  })

  describe("for a path that matches the list", () => {
    beforeEach(() => {
      mockPathname = "/login-required"
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
      mockPathname = "/not-allowed"
    })
    itShouldWaitForAuthState()
    itShouldVerifyLoginState()
  })

  describe("for a path that matches the list", () => {
    beforeEach(() => {
      mockPathname = "/not-required"
    })
    itShouldRenderImmediately()
    itShouldIgnoreLoggedInState()
  })
})
