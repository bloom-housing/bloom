import * as React from "react"
import { useForm } from "react-hook-form"
import HouseholdSizeField from "./HouseholdSizeField"

export default {
  title: "Forms/HouseholdSizeField",
  decorators: [(storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>],
}

export const errorHouseholdSizeField = () => {
  const { register } = useForm({ mode: "onChange" })
  return (
    <HouseholdSizeField
      assistanceUrl={""}
      clearErrors={() => {
        alert("clearErrors called")
      }}
      error={{ message: "Uh oh!" }}
      householdSize={1}
      householdSizeMax={3}
      householdSizeMin={2}
      register={register}
      validate={true}
    />
  )
}
