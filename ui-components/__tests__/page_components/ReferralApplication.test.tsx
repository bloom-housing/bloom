import React from "react"
import { render, cleanup } from "@testing-library/react"
import ReferralApplication from "../../src/page_components/listing/listing_sidebar/ReferralApplication"

afterEach(cleanup)

describe("<ReferralApplication>", () => {
  it("renders without error", () => {
    const { getByText } = render(
      <ReferralApplication
        phoneNumber={"211"}
        description={"Referral description"}
        title={"For further information"}
      />
    )
    expect(getByText("211", { exact: false })).toBeTruthy()
    expect(getByText("Referral description")).toBeTruthy()
    expect(getByText("For further information")).toBeTruthy()
  })
})
