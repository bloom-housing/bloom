import React from "react"
import { render, cleanup } from "@testing-library/react"
import { AdditionalFees } from "../../src/page_components/listing/AdditionalFees"

afterEach(cleanup)

describe("<AdditionalFees>", () => {
  it("renders without error", () => {
    const { getByText } = render(
      <AdditionalFees
        applicationFee={"$30"}
        deposit={"$1140 - $1500"}
        costsNotIncluded={"Resident responsible for PG&E, internet and phone."}
        strings={{
          sectionHeader: "Additional Fees",
          deposit: "Deposit",
          applicationFee: "Application Fee",
          applicationFeeSubtext: ["per applicant age 18 and over", "Due at interview"],
          depositSubtext: ["or one month's rent", "May be higher for lower credit scores"],
        }}
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
    expect(getByText("per applicant age 18 and over")).toBeTruthy()
    expect(getByText("Due at interview")).toBeTruthy()
    expect(getByText("or one month's rent")).toBeTruthy()
    expect(getByText("May be higher for lower credit scores")).toBeTruthy()
  })
})
