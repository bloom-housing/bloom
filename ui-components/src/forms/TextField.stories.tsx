import React from "react"
import { useForm } from "react-hook-form"
import { Field } from "./Field"

export default {
  title: "Forms/Text Field",
  decorators: [(storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>],
}

export const TextFieldDefault = () => {
  const { register } = useForm({ mode: "onChange" })
  return <Field register={register} name={"Test Input"} label={"Custom label"} type={"text"} />
}

export const TextFieldError = () => {
  const { register } = useForm({ mode: "onChange" })
  return (
    <Field
      register={register}
      name={"Test Input"}
      label={"Custom label"}
      type={"text"}
      error={true}
      errorMessage={"Custom error message"}
    />
  )
}

export const CurrencyField = () => {
  const { register, getValues, setValue } = useForm({ mode: "onChange" })
  return (
    <Field
      register={register}
      name={"Test Input"}
      className={"custom-class"}
      controlClassName={"custom-control-class"}
      describedBy={"Test Input"}
      label={"Test Input Custom"}
      type={"currency"}
      getValues={getValues}
      setValue={setValue}
    />
  )
}

export const CurrencyFieldError = () => {
  const { register, getValues, setValue } = useForm({ mode: "onChange" })
  return (
    <Field
      register={register}
      name={"Test Input"}
      error={true}
      errorMessage={"Custom error message"}
      className={"custom-class"}
      controlClassName={"custom-control-class"}
      describedBy={"Test Input"}
      label={"Test Input Custom"}
      type={"currency"}
      getValues={getValues}
      setValue={setValue}
    />
  )
}
