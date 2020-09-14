import React from "react"

import { DOBField } from "./DOBField"
import { HouseholdMember } from "@bloom-housing/core"

export default {
  title: "Forms/DOBField",
  decorators: [(storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>],
}

const member = ({
  birthMonth: null,
  birthDay: null,
  birthYear: null,
} as unknown) as HouseholdMember

export const Default = () => (
  <DOBField
    applicant={member}
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
