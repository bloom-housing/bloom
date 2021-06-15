import React from "react"
import { render, cleanup } from "@testing-library/react"
import { Waitlist } from "../../src/page_components/listing/listing_sidebar/Waitlist"
import Archer from "../fixtures/archer.json"
import Triton from "../fixtures/triton-test.json"

const archer = Object.assign({}, Archer) as any
const triton = Object.assign({}, Triton) as any
archer.property = {}
archer.property.unitsSummarized = {}
archer.property.unitsSummarized.byNonReservedUnitType = []
archer.property.unitsSummarized.byReservedType = []
archer.waitlistCurrentSize = 300

triton.property = {}
triton.property.unitsSummarized = {}
triton.property.unitsSummarized.byNonReservedUnitType = []
triton.property.unitsSummarized.byReservedType = []

afterEach(cleanup)

describe("<Waitlist>", () => {
  it("renders with a closed waitlist", () => {
    const { getByText, getAllByText } = render(<Waitlist listing={archer} />)
    expect(getByText("Waitlist Closed")).toBeTruthy()
    expect(getByText("Current Waitlist Size"))
    expect(getByText("Final Waitlist Size"))
    expect(getAllByText("300").length).toBe(2)
  })
  it("renders with and open waitlist", () => {
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
    newListing.property.unitsAvailable = 1
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
