import React from "react"
import { render, cleanup } from "@testing-library/react"
import { DOBField } from "../../src/forms/DOBField"
import { HouseholdMember } from "@bloom-housing/backend-core/types"

afterEach(cleanup)

const member = ({
  birthMonth: "September",
  birthDay: "6",
  birthYear: "1994",
} as unknown) as HouseholdMember

describe("<Component>", () => {
  it("testing", () => {
    const { debug } = render(
      <DOBField
        applicant={member}
        required={true}
        register={() => {
          //
        }}
        error={{}}
        watch={() => {
          //
        }}
        label="Date of Birth"
      />
    )
  })
})
