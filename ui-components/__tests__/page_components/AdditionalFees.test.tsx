import React from "react"
import { render, cleanup } from "@testing-library/react"
import { AdditionalFees } from "../../src/page_components/listing/AdditionalFees"

afterEach(cleanup)

describe("<AdditionalFees>", () => {
  it("renders without error", () => {
    const { getByText } = render(
      <AdditionalFees
        applicationFee={"30"}
        depositMin={"1140"}
        depositMax={"1500"}
        costsNotIncluded={"Resident responsible for PG&E, internet and phone."}
      />
    )
    expect(getByText("Additional Fees")).toBeTruthy()
    expect(getByText("Application Fee")).toBeTruthy()
    expect(getByText("30", { exact: false })).toBeTruthy()
    expect(getByText("Deposit")).toBeTruthy()
    expect(getByText("1140", { exact: false })).toBeTruthy()
    expect(getByText("1500", { exact: false })).toBeTruthy()
    expect(
      getByText("Resident responsible for PG&E, internet and phone.", { exact: false })
    ).toBeTruthy()
  })
})
