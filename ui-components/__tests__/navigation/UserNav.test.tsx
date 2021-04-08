import React from "react"
import { render, cleanup, fireEvent } from "@testing-library/react"
import { UserNav } from "../../src/navigation/UserNav"

afterEach(cleanup)

describe("<UserNav>", () => {
  it("renders while signed in and shows children", () => {
    const signOutSpy = jest.fn()
    const { getByText } = render(
      <UserNav signedIn={true} signOut={signOutSpy}>
        Children go here
      </UserNav>
    )
    expect(getByText("Sign Out")).toBeTruthy()
    fireEvent.click(getByText("Sign Out"))
    expect(signOutSpy).toHaveBeenCalledTimes(1)
    expect(getByText("Children go here")).toBeTruthy()
  })
  it("renders while signed out and does not show children", () => {
    const signOutSpy = jest.fn()
    const { getByText, queryByText } = render(
      <UserNav signedIn={false} signOut={signOutSpy}>
        Children go here
      </UserNav>
    )
    expect(getByText("Sign In")).toBeTruthy()
    expect(queryByText("Children go here")).toBeNull()
  })
})
