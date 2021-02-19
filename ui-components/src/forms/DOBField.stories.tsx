import React from "react"

import { DOBField } from "./DOBField"
import { HouseholdMember } from "@bloom-housing/backend-core/types"

export default {
  title: "Forms/Date of Birth Field",
  decorators: [(storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>],
}

const member = ({
  birthMonth: undefined,
  birthDay: undefined,
  birthYear: undefined,
} as unknown) as HouseholdMember

export const Default = () => (
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
