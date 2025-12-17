import React from "react"
import { render, cleanup, screen } from "@testing-library/react"
import { AdditionalFees } from "../../../../src/components/listing/listing_sections/AdditionalFees"
import { EnumListingDepositType } from "@bloom-housing/shared-helpers/src/types/backend-swagger"

afterEach(cleanup)

describe("<AdditionalFees>", () => {
  it("shows nothing if no content", () => {
    render(
      <AdditionalFees
        applicationFee={null}
        costsNotIncluded={null}
        depositHelperText={null}
        depositMax={null}
        depositMin={null}
        depositValue={null}
        depositType={null}
        isNonRegulated={null}
        utilitiesIncluded={[]}
        creditScreeningFee={null}
      />
    )
    expect(screen.queryByText("Additional fees")).toBeNull()
  })

  it("renders all content (regulated listing)", () => {
    render(
      <AdditionalFees
        applicationFee={"50"}
        costsNotIncluded={"Gas, internet"}
        depositHelperText={"Deposit helper text"}
        depositMax={"200"}
        depositMin={"100"}
        utilitiesIncluded={["Water, Electricity"]}
        creditScreeningFee={"25"}
        depositValue={null}
        depositType={null}
        isNonRegulated={false}
      />
    )
    expect(screen.getByText("Additional fees")).toBeDefined()
    expect(screen.getByText("Application fee")).toBeDefined()
    expect(screen.getByText("per applicant age 18 and over")).toBeDefined()
    expect(screen.getByText("Due at interview")).toBeDefined()
    expect(screen.getByText("$50")).toBeDefined()
    expect(screen.getByText("Deposit")).toBeDefined()
    expect(screen.getByText("$100 – $200", { exact: false })).toBeDefined()
    expect(screen.getByText("Credit screening")).toBeDefined()
    expect(screen.getByText("$25")).toBeDefined()
    expect(
      screen.getByText("covers the cost of reviewing your credit and rental history")
    ).toBeDefined()
    expect(screen.getByText("Utilities included")).toBeDefined()
    expect(screen.getByText("Water, Electricity")).toBeDefined()
    expect(screen.getByText("Costs not included")).toBeDefined()
    expect(screen.getByText("Gas, internet")).toBeDefined()
  })

  it("renders all content except utilities included (regulated listing)", () => {
    render(
      <AdditionalFees
        applicationFee={"50"}
        costsNotIncluded={"Costs not included"}
        depositHelperText={"Deposit helper text"}
        depositMax={"200"}
        depositMin={"100"}
        utilitiesIncluded={[]}
        creditScreeningFee={"25"}
        depositValue={null}
        depositType={null}
        isNonRegulated={false}
      />
    )
    expect(screen.getByText("Additional fees")).toBeDefined()
    expect(screen.getByText("Application fee")).toBeDefined()
    expect(screen.getByText("per applicant age 18 and over")).toBeDefined()
    expect(screen.getByText("Due at interview")).toBeDefined()
    expect(screen.getByText("$50")).toBeDefined()
    expect(screen.getByText("Deposit")).toBeDefined()
    expect(screen.getByText("$100 – $200", { exact: false })).toBeDefined()
    expect(screen.getByText("Credit screening")).toBeDefined()
    expect(screen.getByText("$25")).toBeDefined()
    expect(
      screen.getByText("covers the cost of reviewing your credit and rental history")
    ).toBeDefined()
    expect(screen.queryByText("Utilities included")).toBeNull()
  })

  it("renders just deposit min (regulated)", () => {
    render(
      <AdditionalFees
        applicationFee={null}
        costsNotIncluded={null}
        depositHelperText={null}
        depositMax={null}
        depositMin={"100"}
        utilitiesIncluded={[]}
        creditScreeningFee={null}
        depositValue={null}
        depositType={null}
        isNonRegulated={false}
      />
    )
    expect(screen.getByText("Additional fees")).toBeDefined()
    expect(screen.getByText("Deposit")).toBeDefined()
    expect(screen.getByText("$100", { exact: false })).toBeDefined()
  })

  it("renders just deposit max (regulated)", () => {
    render(
      <AdditionalFees
        applicationFee={null}
        costsNotIncluded={null}
        depositHelperText={null}
        depositMax={"200"}
        depositMin={null}
        utilitiesIncluded={[]}
        creditScreeningFee={null}
        depositValue={null}
        depositType={null}
        isNonRegulated={false}
      />
    )
    expect(screen.getByText("Additional fees")).toBeDefined()
    expect(screen.getByText("Deposit")).toBeDefined()
    expect(screen.getByText("$200", { exact: false })).toBeDefined()
  })

  it("renders deposit value for non-regulated listing", () => {
    render(
      <AdditionalFees
        applicationFee={null}
        costsNotIncluded={null}
        depositHelperText={null}
        depositMax={null}
        depositMin={null}
        utilitiesIncluded={[]}
        depositValue={2137}
        depositType={EnumListingDepositType.fixedDeposit}
        isNonRegulated={true}
      />
    )

    expect(screen.getByRole("heading", { level: 3, name: "Additional fees" })).toBeInTheDocument()
    expect(screen.getByRole("heading", { level: 4, name: "Deposit" })).toBeInTheDocument()
    expect(screen.getByText("$ 2137")).toBeInTheDocument()
  })

  it("renders deposit range for non-regulated listing", () => {
    render(
      <AdditionalFees
        applicationFee={null}
        costsNotIncluded={null}
        depositHelperText={null}
        depositMax={"480"}
        depositMin={"250"}
        utilitiesIncluded={[]}
        depositValue={null}
        depositType={EnumListingDepositType.depositRange}
        isNonRegulated={true}
      />
    )

    expect(screen.getByRole("heading", { level: 3, name: "Additional fees" })).toBeInTheDocument()
    expect(screen.getByRole("heading", { level: 4, name: "Deposit" })).toBeInTheDocument()
    expect(screen.getByText(/\$250.*\$480/, { exact: false })).toBeDefined()
  })

  it("renders credit screening fee", () => {
    const { getByText } = render(
      <AdditionalFees
        applicationFee={null}
        costsNotIncluded={null}
        depositHelperText={null}
        depositMax={null}
        depositMin={null}
        depositValue={null}
        depositType={null}
        isNonRegulated={false}
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
        depositValue={null}
        depositType={null}
        isNonRegulated={false}
        utilitiesIncluded={[]}
        creditScreeningFee={""}
      />
    )
    expect(getByText("Additional fees")).toBeDefined()
    expect(queryByText("Credit screening")).toBeNull()
  })
})
