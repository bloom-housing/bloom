import React from "react"
import { render, cleanup, fireEvent } from "@testing-library/react"
import { FieldGroup } from "../../src/forms/FieldGroup"
import { useForm } from "react-hook-form"

afterEach(cleanup)

const FieldGroupCustom = () => {
  const { register } = useForm({ mode: "onChange" })
  return (
    <FieldGroup
      register={register}
      name={"Test Input"}
      type={"text"}
      fields={[
        { id: "1234", label: "Input 1", description: "Input description" },
        { id: "5678", label: "Input 2" },
      ]}
      fieldGroupClassName={"field-group-classname"}
      fieldClassName={"field-classname"}
      groupNote={"Group Note"}
      groupLabel={"Group Label"}
    />
  )
}

const FieldGroupError = () => {
  const { register } = useForm({ mode: "onChange" })
  return (
    <FieldGroup
      register={register}
      name={"Test Input"}
      error={true}
      type={"text"}
      fields={[
        { id: "1234", label: "Input 1" },
        { id: "5678", label: "Input 2" },
      ]}
      errorMessage={"Uh oh!"}
    />
  )
}

describe("<FieldGroup>", () => {
  it("renders with label and note", () => {
    const { getByText, queryByText } = render(<FieldGroupCustom />)
    expect(getByText("Group Note")).toBeTruthy()
    expect(getByText("Group Label")).toBeTruthy()
    expect(getByText("Input 1")).toBeTruthy()
    expect(getByText("Input 2")).toBeTruthy()
    expect(getByText("read more")).toBeTruthy()
    expect(queryByText("Input description")).toBeNull()
    fireEvent.click(getByText("read more"))
    expect(getByText("Input description")).toBeTruthy()
  })
  it("renders with an error state", () => {
    const { getByText } = render(<FieldGroupError />)
    expect(getByText("Input 1")).toBeTruthy()
    expect(getByText("Input 2")).toBeTruthy()
    expect(getByText("Uh oh!")).toBeTruthy()
  })
})
