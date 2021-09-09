import React from "react"
import { render, cleanup } from "@testing-library/react"
import { HousingCounselor } from "../../src/blocks/HousingCounselor"

afterEach(cleanup)

describe("<HousingCounselor>", () => {
  it("renders with only required fields", () => {
    const { getByText } = render(
      <HousingCounselor name={"Counselor Name"} languages={["English"]} />
    )
    expect(getByText("Counselor Name")).not.toBeNull()
    expect(getByText("English", { exact: false })).not.toBeNull()
  })

  it("renders with all fields", () => {
    const { getByText } = render(
      <HousingCounselor
        name={"Counselor Name"}
        languages={["English", "Spanish", "Chinese"]}
        addressStreet={"123 Main St"}
        addressCityState={"San Francisco, CA"}
        website={"www.counselor.org"}
        phone={"123-456-7890"}
      />
    )
    expect(getByText("Counselor Name")).not.toBeNull()
    expect(getByText("English", { exact: false })).not.toBeNull()
    expect(getByText("Spanish", { exact: false })).not.toBeNull()
    expect(getByText("Chinese", { exact: false })).not.toBeNull()
    expect(getByText("123 Main St", { exact: false })).not.toBeNull()
    expect(getByText("San Francisco, CA", { exact: false })).not.toBeNull()
    expect(getByText("123-456-7890", { exact: false })).not.toBeNull()
    expect(getByText("Website").closest("a")?.getAttribute("href")).toBe("www.counselor.org")
  })
})
