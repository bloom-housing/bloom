import React from "react"
import { useForm } from "react-hook-form"
import { TimeField } from "./TimeField"

export default {
  title: "Forms/Time Field",
  decorators: [(storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>],
}

export const Default = () => {
  const { register, watch, handleSubmit, errors} = useForm({ mode: "onChange" })

  const field = watch("time")

  return (
    <>
      <TimeField
        id="time"
        name="time"
        required={true}
        register={register}
        error={!!errors?.time}
        watch={watch}
      />

      {console.log(field)}
    </>
  )
}