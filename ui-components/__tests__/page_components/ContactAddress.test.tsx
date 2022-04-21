import React from "react"
import { render, cleanup } from "@testing-library/react"
import { ContactAddress } from "../../src/page_components/listing/listing_sidebar/ContactAddress"

afterEach(cleanup)

describe("<ContactAddress>", () => {
  it("renders with address", () => {
    const { getByText } = render(
      <ContactAddress
        address={{ street: "Street", street2: "Street 2", city: "City", zipCode: "Zip Code" }}
        mapString={"Get Directions"}
      />
    )
    expect(getByText("Street", { exact: false })).toBeTruthy()
    expect(getByText("Street 2", { exact: false })).toBeTruthy()
    expect(getByText("City", { exact: false })).toBeTruthy()
    expect(getByText("Zip Code", { exact: false })).toBeTruthy()
    expect(getByText("Get Directions")).toBeTruthy()
  })
  it("renders with no address", () => {
    const { queryByText } = render(<ContactAddress mapString={"Get Directions"} />)
    expect(queryByText("Get Directions")).toBeNull()
  })
})
