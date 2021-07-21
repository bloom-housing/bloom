import React from "react"
import { DOBField } from "./DOBField"
import { useForm } from "react-hook-form"

export default {
  title: "Forms/Date of Birth Field",
  decorators: [(storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>],
}

export const Default = () => {
  const { register, watch, errors } = useForm({ mode: "onChange" })

  return (
    <DOBField
      id="dateOfBirth"
      name="dateOfBirth"
      label="Date of Birth"
      required={true}
      register={register}
      watch={watch}
      error={errors?.dateOfBirth}
      validateAge18={true}
    />
  )
}
