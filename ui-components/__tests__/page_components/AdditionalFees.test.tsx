import React from "react"
import { render, cleanup } from "@testing-library/react"
import { AdditionalFees } from "../../src/page_components/listing/AdditionalFees"
import Archer from "../fixtures/archer.json"
afterEach(cleanup)

const listing = Object.assign({}, Archer) as any

describe("<Additional Fees>", () => {
  it("renders without error", () => {
    const { getByText } = render(<AdditionalFees listing={listing} />)
    expect(getByText("Additional Fees")).toBeTruthy()
    expect(getByText("Application Fee")).toBeTruthy()
    expect(getByText("30", { exact: false })).toBeTruthy()
    expect(getByText("Deposit")).toBeTruthy()
    expect(getByText("1140", { exact: false })).toBeTruthy()
    expect(
      getByText("Resident responsible for PG&E, internet and phone.", { exact: false })
    ).toBeTruthy()
  })
})
