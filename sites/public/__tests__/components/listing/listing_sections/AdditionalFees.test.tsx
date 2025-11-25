import React from "react"
import { render, cleanup, screen } from "@testing-library/react"
import { AdditionalFees } from "../../../../src/components/listing/listing_sections/AdditionalFees"

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
        depositValue={null}
        depositType={null}
        isNonRegulated={false}
      />
    )
    expect(screen.getByText("Additional fees")).toBeDefined()
    expect(screen.getByText("Deposit")).toBeDefined()
    expect(screen.getByText("$200", { exact: false })).toBeDefined()
  })
})
