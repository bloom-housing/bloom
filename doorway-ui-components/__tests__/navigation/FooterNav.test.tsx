import React from "react"
import { render, cleanup } from "@testing-library/react"
import { FooterNav } from "../../src/navigation/FooterNav"

afterEach(cleanup)

describe("<FooterNav>", () => {
  it("renders without error", () => {
    const { getByText } = render(
      <FooterNav copyright={"Copyright Exygy 2021"}>Children go here</FooterNav>
    )
    expect(getByText("Copyright Exygy 2021")).toBeTruthy()
  })
})
