import React from "react"
import { render, cleanup } from "@testing-library/react"
import { ListingsList } from "../../src/page_components/listing/ListingsList"
import Archer from "../fixtures/archer.json"
import Triton from "../fixtures/triton-test.json"
import { Listing } from "@bloom-housing/backend-core/types"

afterEach(cleanup)

const archer = Object.assign({}, Archer) as any
const triton = Object.assign({}, Triton) as any
archer.property = {}
archer.property.unitsSummarized = {}
archer.property.unitsSummarized.byNonReservedUnitType = []
archer.property.unitsSummarized.byReservedType = []

triton.property = {}
triton.property.unitsSummarized = {}
triton.property.unitsSummarized.byNonReservedUnitType = []
triton.property.unitsSummarized.byReservedType = []
const listings = [archer, triton] as Listing[]

describe("<ListingsList>", () => {
  it("renders without error", () => {
    const { getByText, getAllByText } = render(<ListingsList listings={listings} />)
    expect(getByText(archer.name)).toBeTruthy()
    expect(getByText(triton.name)).toBeTruthy()
    expect(getAllByText("See Details").length).toBe(2)
  })
})
