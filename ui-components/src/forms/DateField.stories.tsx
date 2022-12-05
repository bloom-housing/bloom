import React from "react"
import { DateField, DateFieldValues } from "./DateField"
import { useForm, FieldError, DeepMap } from "react-hook-form"

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

export const Error = () => {
  const { register, watch, errors } = useForm({ mode: "onChange" })

  return (
    <DateField
      id="appDueDate"
      name="appDueDate"
      label="Application Due Date"
      required={true}
      register={register}
      watch={watch}
      error={{ year: true } as any}
      errorMessage={"DateField error message"}
    />
  )
}

export const Note = () => {
  const { register, watch, errors } = useForm({ mode: "onChange" })

  return (
    <DateField
      id="appDueDate"
      name="appDueDate"
      label="Application Due Date"
      required={true}
      register={register}
      watch={watch}
      note={"DateField note"}
    />
  )
}

export const ErrorAndNote = () => {
  const { register, watch, errors } = useForm({ mode: "onChange" })

  return (
    <DateField
      id="appDueDate"
      name="appDueDate"
      label="Application Due Date"
      required={true}
      register={register}
      watch={watch}
      note={"DateField note"}
      error={{ year: true } as any}
      errorMessage={"DateField error message"}
    />
  )
}
