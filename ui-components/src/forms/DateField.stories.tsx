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
      id="appDueDate"
      name="appDueDate"
      label="Application Due Date"
      required={true}
      register={register}
      watch={watch}
      error={errors?.appDueDate}
    />
  )
}
