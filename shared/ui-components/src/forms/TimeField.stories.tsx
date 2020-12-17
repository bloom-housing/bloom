import React from "react"
import { useForm } from "react-hook-form"
import { TimeField } from "./TimeField"

export default {
  title: "Forms/Time Field",
  decorators: [(storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>],
}

export const Default = () => {
  const { register, errors } = useForm({ mode: "onChange" })

  return (
    <TimeField
      id="time"
      label="Time"
      name="time"
      required={true}
      register={register}
      error={!!errors?.time}
    />
  )
}