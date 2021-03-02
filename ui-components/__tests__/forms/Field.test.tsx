import React from "react"
import { render, cleanup } from "@testing-library/react"
import { Field } from "../../src/forms/Field"
import { useForm } from "react-hook-form"

afterEach(cleanup)

const FieldDefault = () => {
  const { register } = useForm({ mode: "onChange" })
  return (
    <Field register={register} name={"Test Input"} label={"Test Input Default"} type={"text"} />
  )
}

const FieldError = () => {
  const { register } = useForm({ mode: "onChange" })
  return (
    <Field
      register={register}
      name={"Test Input"}
      error={true}
      errorMessage={"Uh oh!"}
      label={"Test Input Error"}
      type={"text"}
    />
  )
}

const FieldCustomProps = () => {
  const { register } = useForm({ mode: "onChange" })
  return (
    <Field
      register={register}
      name={"Test Input"}
      error={true}
      className={"custom-class"}
      controlClassName={"custom-control-class"}
      caps={true}
      primary={true}
      readerOnly={true}
      prepend={"Enter Here:"}
      describedBy={"Test Input"}
      label={"Test Input Custom"}
      type={"text"}
    />
  )
}

describe("<Field>", () => {
  it("default", () => {
    const { getByLabelText } = render(<FieldDefault />)
    expect(getByLabelText("Test Input Default")).toBeTruthy()
  })
  it("error", () => {
    const { getByText, getByLabelText } = render(<FieldError />)
    expect(getByText("Uh oh!")).toBeTruthy()
    expect(getByLabelText("Test Input Error")).toBeTruthy()
  })
  it("custom", async () => {
    const { getByText, getByLabelText } = render(<FieldCustomProps />)
    expect(getByText("Enter Here:")).toBeTruthy()
    expect(getByLabelText("Test Input Custom")).toBeTruthy()
  })
})
