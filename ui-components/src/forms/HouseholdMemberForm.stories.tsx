import * as React from "react"
import HouseholdMemberForm from "./HouseholdMemberForm"

export default {
  title: "Forms/HouseholdMemberForm",
  decorators: [(storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>],
}

export const editable = () => (
  <HouseholdMemberForm
    memberFirstName={"Firstname"}
    memberLastName={"Lastname"}
    key={"FirstnameLastname"}
    subtitle={"Household Member"}
    editMember={() => {}}
  />
)

export const notEditable = () => (
  <HouseholdMemberForm
    memberFirstName={"Firstname"}
    memberLastName={"Lastname"}
    key={"FirstnameLastname"}
    subtitle={"Household Member"}
    editMode={false}
  />
)
