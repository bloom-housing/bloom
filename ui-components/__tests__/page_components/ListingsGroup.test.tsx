import React from "react"
import { render, cleanup, fireEvent } from "@testing-library/react"
import { ListingsGroup } from "../../src/page_components/listing/ListingsGroup"
import Archer from "../fixtures/archer.json"
import Triton from "../fixtures/triton-test.json"
import { Listing } from "@bloom-housing/backend-core/types"

afterEach(cleanup)

const archer = Object.assign({}, Archer) as any
const triton = Object.assign({}, Triton) as any
archer.property = {}
archer.property.unitsSummarized = {}
archer.property.unitsSummarized.byUnitType = []

triton.property = {}
triton.property.unitsSummarized = {}
triton.property.unitsSummarized.byUnitType = []
const listings = [archer, triton] as Listing[]

describe("<ListingsGroup>", () => {
  it("renders with show text", () => {
    const { getByText } = render(
      <ListingsGroup
        listings={listings}
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
        listings={listings}
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
