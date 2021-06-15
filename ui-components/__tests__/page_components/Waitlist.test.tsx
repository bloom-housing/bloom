import React from "react"
import { render, cleanup } from "@testing-library/react"
import { Waitlist } from "../../src/page_components/listing/listing_sidebar/Waitlist"
import Archer from "../fixtures/archer.json"
import Triton from "../fixtures/triton-test.json"
import { Listing } from "@bloom-housing/backend-core/types"

const archer: Listing = Object.assign({}, Archer) as any
const triton: Listing = Object.assign({}, Triton) as any

// @ts-ignore
archer.unitsSummarized = {}
archer.unitsSummarized.byNonReservedUnitType = []
archer.unitsSummarized.byReservedType = []
archer.waitlistCurrentSize = 300

// @ts-ignore
triton.unitsSummarized = {}
triton.unitsSummarized.byNonReservedUnitType = []
triton.unitsSummarized.byReservedType = []

afterEach(cleanup)

describe("<Waitlist>", () => {
  it("renders with a closed waitlist", () => {
    const { getByText, getAllByText } = render(<Waitlist listing={archer} />)
    expect(getByText("Waitlist Closed")).toBeTruthy()
    expect(getByText("Current Waitlist Size"))
    expect(getByText("Final Waitlist Size"))
    expect(getAllByText("300").length).toBe(2)
  })
  it("renders with an open waitlist", () => {
    triton.unitsAvailable = 0
    triton.waitlistCurrentSize = 40
    triton.waitlistMaxSize = 100
    const { getByText } = render(<Waitlist listing={triton} />)
    expect(getByText("Waitlist is open")).toBeTruthy()
    expect(getByText("Current Waitlist Size"))
    expect(getByText("40")).toBeTruthy()
    expect(getByText("Final Waitlist Size"))
    expect(getByText("100")).toBeTruthy()
    expect(getByText("Submit an application for an open slot on the waitlist.")).toBeTruthy()
  })
  it("renders with open spots", () => {
    const newListing = triton
    newListing.unitsAvailable = 1
    newListing.waitlistCurrentSize = 0
    newListing.waitlistMaxSize = 10
    const { getByText } = render(<Waitlist listing={newListing} />)
    expect(
      getByText(
        "Once ranked applicants fill all available units, the remaining ranked applicants will be placed on a waitlist for those same units."
      )
    ).toBeTruthy()
  })
})
