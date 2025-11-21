import React from "react"
import { render, cleanup } from "@testing-library/react"
import { AdditionalFees } from "../../../../src/components/listing/listing_sections/AdditionalFees"

afterEach(cleanup)

describe("<AdditionalFees>", () => {
  it("shows nothing if no content", () => {
    const { queryByText } = render(
      <AdditionalFees
        applicationFee={null}
        costsNotIncluded={null}
        depositHelperText={null}
        depositMax={null}
        depositMin={null}
        utilitiesIncluded={[]}
        creditScreeningFee={null}
      />
    )
    expect(queryByText("Additional fees")).toBeNull()
  })

  it("renders all content", () => {
    const { getByText } = render(
      <AdditionalFees
        applicationFee={"50"}
        costsNotIncluded={"Gas, internet"}
        depositHelperText={"Deposit helper text"}
        depositMax={"200"}
        depositMin={"100"}
        utilitiesIncluded={["Water, Electricity"]}
        creditScreeningFee={"25"}
      />
    )
    expect(getByText("Additional fees")).toBeDefined()
    expect(getByText("Application fee")).toBeDefined()
    expect(getByText("per applicant age 18 and over")).toBeDefined()
    expect(getByText("Due at interview")).toBeDefined()
    expect(getByText("$50")).toBeDefined()
    expect(getByText("Deposit")).toBeDefined()
    expect(getByText("$100 – $200", { exact: false })).toBeDefined()
    expect(getByText("Credit screening")).toBeDefined()
    expect(getByText("$25")).toBeDefined()
    expect(getByText("covers the cost of reviewing your credit and rental history")).toBeDefined()
    expect(getByText("Utilities included")).toBeDefined()
    expect(getByText("Water, Electricity")).toBeDefined()
    expect(getByText("Costs not included")).toBeDefined()
    expect(getByText("Gas, internet")).toBeDefined()
  })

  it("renders all content except utilities included", () => {
    const { getByText, queryByText } = render(
      <AdditionalFees
        applicationFee={"50"}
        costsNotIncluded={"Costs not included"}
        depositHelperText={"Deposit helper text"}
        depositMax={"200"}
        depositMin={"100"}
        utilitiesIncluded={[]}
        creditScreeningFee={"25"}
      />
    )
    expect(getByText("Additional fees")).toBeDefined()
    expect(getByText("Application fee")).toBeDefined()
    expect(getByText("per applicant age 18 and over")).toBeDefined()
    expect(getByText("Due at interview")).toBeDefined()
    expect(getByText("$50")).toBeDefined()
    expect(getByText("Deposit")).toBeDefined()
    expect(getByText("$100 – $200", { exact: false })).toBeDefined()
    expect(getByText("Credit screening")).toBeDefined()
    expect(getByText("$25")).toBeDefined()
    expect(getByText("covers the cost of reviewing your credit and rental history")).toBeDefined()
    expect(queryByText("Utilities included")).toBeNull()
  })

  it("renders just deposit min", () => {
    const { getByText } = render(
      <AdditionalFees
        applicationFee={null}
        costsNotIncluded={null}
        depositHelperText={null}
        depositMax={null}
        depositMin={"100"}
        utilitiesIncluded={[]}
        creditScreeningFee={null}
      />
    )
    expect(getByText("Additional fees")).toBeDefined()
    expect(getByText("Deposit")).toBeDefined()
    expect(getByText("$100", { exact: false })).toBeDefined()
  })

  it("renders just deposit max", () => {
    const { getByText } = render(
      <AdditionalFees
        applicationFee={null}
        costsNotIncluded={null}
        depositHelperText={null}
        depositMax={"200"}
        depositMin={null}
        utilitiesIncluded={[]}
        creditScreeningFee={null}
      />
    )
    expect(getByText("Additional fees")).toBeDefined()
    expect(getByText("Deposit")).toBeDefined()
    expect(getByText("$200", { exact: false })).toBeDefined()
  })

  it("renders credit screening fee", () => {
    const { getByText } = render(
      <AdditionalFees
        applicationFee={null}
        costsNotIncluded={null}
        depositHelperText={null}
        depositMax={null}
        depositMin={null}
        utilitiesIncluded={[]}
        creditScreeningFee={"30"}
      />
    )
    expect(getByText("Additional fees")).toBeDefined()
    expect(getByText("Credit screening")).toBeDefined()
    expect(getByText("$30")).toBeDefined()
    expect(getByText("covers the cost of reviewing your credit and rental history")).toBeDefined()
  })

  it("does not render credit screening fee when empty", () => {
    const { getByText, queryByText } = render(
      <AdditionalFees
        applicationFee={"10"}
        costsNotIncluded={null}
        depositHelperText={null}
        depositMax={null}
        depositMin={null}
        utilitiesIncluded={[]}
        creditScreeningFee={""}
      />
    )
    expect(getByText("Additional fees")).toBeDefined()
    expect(queryByText("Credit screening")).toBeNull()
  })
})
