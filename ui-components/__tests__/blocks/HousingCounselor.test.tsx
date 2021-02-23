import React from "react"
import { render, cleanup } from "@testing-library/react"
import { HousingCounselor } from "../../src/blocks/HousingCounselor"

afterEach(cleanup)

const counselor = {
  name: "Counselor Name",
  address: "123 Main St",
  citystate: "San Francisco, CA",
  website: "www.counselor.org",
  phone: "123-456-7890",
}

describe("<HousingCounselor>", () => {
  it("renders with only required fields", () => {
    const { getByText } = render(
      <HousingCounselor
        counselor={{
          name: counselor.name,
          languages: ["English"],
        }}
      />
    )
    expect(getByText(counselor.name)).not.toBeNull()
    expect(getByText("English", { exact: false })).not.toBeNull()
  })

  it("renders with all fields", () => {
    const { getByText } = render(
      <HousingCounselor
        counselor={{
          name: counselor.name,
          languages: ["English", "Spanish", "Chinese"],
          address: counselor.address,
          citystate: counselor.citystate,
          website: counselor.website,
          phone: counselor.phone,
        }}
      />
    )
    expect(getByText(counselor.name)).not.toBeNull()
    expect(getByText("English", { exact: false })).not.toBeNull()
    expect(getByText("Spanish", { exact: false })).not.toBeNull()
    expect(getByText("Chinese", { exact: false })).not.toBeNull()
    expect(getByText(counselor.address, { exact: false })).not.toBeNull()
    expect(getByText(counselor.phone, { exact: false })).not.toBeNull()
    expect(getByText(counselor.name).closest("a")?.getAttribute("href")).toBe(counselor.website)
  })
})
