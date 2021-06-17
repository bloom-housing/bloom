import React from "react"
import { DateField } from "./DateField"
import { useForm } from "react-hook-form"

export default {
  title: "Forms/Date Field",
  decorators: [(storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>],
}

export const Default = () => {
  const { register, watch, errors } = useForm({ mode: "onChange" })

  return (
    <DateField
      id="applicationDueDate"
      name="applicationDueDate"
      label="Application Due Date"
      required={true}
      register={register}
      watch={watch}
      error={errors?.applicationDueDate}
    />
  )
}

export const Birthday = () => {
  const { register, watch, errors } = useForm({ mode: "onChange" })

  return (
    <DateField
      id="dateOfBirth"
      name="dateOfBirth"
      label="Date of Birth"
      required={true}
      register={register}
      watch={watch}
      error={errors?.dateOfBirth}
      birthdate={true}
      errorMessage={"Please enter a valid Date of Birth, must be 18 or older"}
    />
  )
}
