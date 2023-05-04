import React from "react"
import { render, cleanup } from "@testing-library/react"
import { Field } from "../../src/forms/Field"
import { useForm } from "react-hook-form"

afterEach(cleanup)

const FieldDefault = () => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register } = useForm({ mode: "onChange" })
  return (
    <Field register={register} name={"Test Input"} label={"Test Input Default"} type={"text"} />
  )
}

const FieldError = () => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
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
  // eslint-disable-next-line @typescript-eslint/unbound-method
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
      describedBy={"Test Input"}
      label={"Test Input Custom"}
      type={"text"}
    />
  )
}

const FieldCurrency = () => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
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
      placeholder={"Enter Income"}
      prepend={"$"}
    />
  )
}

describe("<Field>", () => {
  it("can render default state", () => {
    const { getByLabelText } = render(<FieldDefault />)
    expect(getByLabelText("Test Input Default")).toBeTruthy()
  })
  it("can render error state", () => {
    const { getByText, getByLabelText } = render(<FieldError />)
    expect(getByText("Uh oh!")).toBeTruthy()
    expect(getByLabelText("Test Input Error")).toBeTruthy()
  })
  it("can render custom state", () => {
    const { getByLabelText } = render(<FieldCustomProps />)
    expect(getByLabelText("Test Input Custom")).toBeTruthy()
  })
  it("can render currency field", () => {
    const { getByText, getByLabelText, getByPlaceholderText } = render(<FieldCurrency />)
    expect(getByLabelText("Test Input Custom")).toBeTruthy()
    expect(getByText("$")).toBeTruthy()
    expect(getByPlaceholderText("Enter Income")).toBeTruthy()
  })
})
