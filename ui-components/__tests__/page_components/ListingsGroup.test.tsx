import React from "react"
import { render, cleanup, fireEvent } from "@testing-library/react"
import { ListingsGroup } from "../../src/page_components/listing/ListingsGroup"

afterEach(cleanup)

describe("<ListingsGroup>", () => {
  it("renders with show text", () => {
    const { getByText } = render(
      <ListingsGroup
        listingsCount={2}
        header={"Header Text"}
        showButtonText={"Show"}
        hideButtonText={"Hide"}
        info={"Info Text"}
      />
    )
    expect(getByText("Header Text")).toBeTruthy()
    expect(getByText("Info Text")).toBeTruthy()
    expect(getByText("Show (2)")).toBeTruthy()
  })
  it("can toggle to hide text", () => {
    const { getByText } = render(
      <ListingsGroup
        listingsCount={2}
        header={"Header Text"}
        showButtonText={"Show"}
        hideButtonText={"Hide"}
      />
    )
    expect(getByText("Header Text")).toBeTruthy()
    fireEvent.click(getByText("Show (2)"))
    expect(getByText("Hide (2)")).toBeTruthy()
  })
})
