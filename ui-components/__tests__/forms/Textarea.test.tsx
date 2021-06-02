import React from "react"
import { render, cleanup } from "@testing-library/react"
import { Textarea } from "../../src/forms/Textarea"
import { useForm } from "react-hook-form"

afterEach(cleanup)

const TextareaDefault = () => {
  const { register } = useForm()
  return <Textarea name={"textarea-test"} label={"Textarea Label"} register={register} />
}

const TextareaCustom = () => {
  const { register } = useForm()
  return (
    <Textarea
      cols={5}
      errorMessage={"Error message"}
      label={"Textarea Label"}
      name={"textarea-test"}
      placeholder={"Custom placeholder"}
      register={register}
      resize={false}
      rows={10}
      wrap={"hard"}
    />
  )
}

describe("<Textarea>", () => {
  it("renders default state", () => {
    const { getByText } = render(<TextareaDefault />)
    expect(getByText("Textarea Label")).toBeTruthy()
  })
  it("renders with custom props", () => {
    const { getByPlaceholderText, getByText } = render(<TextareaCustom />)
    expect(getByText("Textarea Label")).toBeTruthy()
    expect(getByText("Error message")).toBeTruthy()
    expect(getByPlaceholderText("Custom placeholder")).toBeTruthy()
  })
})
