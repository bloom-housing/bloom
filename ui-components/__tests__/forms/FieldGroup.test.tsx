import React from "react"
import { render, cleanup } from "@testing-library/react"
import { FieldGroup } from "../../src/forms/FieldGroup"
import { useForm } from "react-hook-form"

afterEach(cleanup)

const FieldGroupCustom = () => {
  const { register } = useForm({ mode: "onChange" })
  return (
    <FieldGroup
      register={register}
      name={"Test Input"}
      type={"checkbox"}
      fields={[
        { id: "1234", label: "Input 1", note: "Field Note", description: "Input description" },
        { id: "5678", label: "Input 2" },
      ]}
      fieldGroupClassName={"field-group-classname"}
      fieldClassName={"field-classname"}
      groupNote={"Group Note"}
      groupLabel={"Group Label"}
      dataTestId={"unitTest"}
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

const FieldGroupDefaultValues = () => {
  const { register } = useForm({ mode: "onChange" })
  return (
    <FieldGroup
      register={register}
      name={"Test Input"}
      type={"checkbox"}
      fields={[
        { id: "1234", label: "Input 1", defaultChecked: true },
        { id: "5678", label: "Input 2" },
      ]}
      fieldGroupClassName={"field-group-classname"}
      fieldClassName={"field-classname"}
      groupNote={"Group Note"}
      groupLabel={"Group Label"}
      dataTestId={"unitTest"}
    />
  )
}

const FieldGroupSubfieldsUnchecked = () => {
  const { register } = useForm({ mode: "onChange" })
  return (
    <FieldGroup
      register={register}
      name={"Test Input"}
      type={"checkbox"}
      fields={[
        {
          id: "1234",
          label: "Input 1",
          defaultChecked: false,
          subFields: [
            { id: "abcd", label: "Subfield 1", defaultChecked: false, value: "abcd" },
            { id: "efgh", label: "Subfield 2", defaultChecked: false, value: "efgh" },
            {
              id: "ijkl",
              label: "Subfield 3",
              defaultChecked: false,
              value: "ijkl",
              additionalText: true,
            },
          ],
        },
        { id: "5678", label: "Input 2", defaultChecked: false },
      ]}
      fieldGroupClassName={"field-group-classname"}
      fieldClassName={"field-classname"}
      groupNote={"Group Note"}
      groupLabel={"Group Label"}
      dataTestId={"unitTest"}
    />
  )
}

const FieldGroupSubfieldsChecked = () => {
  const { register } = useForm({ mode: "onChange" })
  return (
    <FieldGroup
      register={register}
      name={"Test Input"}
      type={"checkbox"}
      fields={[
        {
          id: "1234",
          label: "Input 1",
          defaultChecked: true,
          subFields: [
            { id: "abcd", label: "Subfield 1", defaultChecked: true, value: "abcd" },
            { id: "efgh", label: "Subfield 2", defaultChecked: true, value: "efgh" },
            {
              id: "ijkl",
              label: "Subfield 3",
              defaultChecked: true,
              value: "ijkl",
              additionalText: true,
            },
          ],
        },
        { id: "5678", label: "Input 2", defaultChecked: true },
      ]}
      fieldGroupClassName={"field-group-classname"}
      fieldClassName={"field-classname"}
      groupNote={"Group Note"}
      groupLabel={"Group Label"}
      dataTestId={"unitTest"}
    />
  )
}

describe("<FieldGroup>", () => {
  it("renders with label and note", () => {
    const { getByText } = render(<FieldGroupCustom />)
    expect(getByText("Group Note")).toBeTruthy()
    expect(getByText("Group Label")).toBeTruthy()
    expect(getByText("Input 1")).toBeTruthy()
    expect(getByText("Field Note")).toBeTruthy()
    expect(getByText("Input 2")).toBeTruthy()
  })
  it("renders with an error state", () => {
    const { getByText } = render(<FieldGroupError />)
    expect(getByText("Input 1")).toBeTruthy()
    expect(getByText("Input 2")).toBeTruthy()
    expect(getByText("Uh oh!")).toBeTruthy()
  })
  it("can check and uncheck an input", () => {
    const { getAllByTestId } = render(<FieldGroupCustom />)
    const checkbox = getAllByTestId("unitTest")[0] as HTMLInputElement
    expect(checkbox).not.toBeChecked()
    fireEvent.click(checkbox)
    expect(checkbox).toBeChecked()
    fireEvent.click(checkbox)
    expect(checkbox).not.toBeChecked()
  })
  it("sets default values", () => {
    const { getAllByTestId } = render(<FieldGroupDefaultValues />)
    const checkbox = getAllByTestId("unitTest")[0] as HTMLInputElement
    expect(checkbox).toBeChecked()
    const checkbox2 = getAllByTestId("unitTest")[1] as HTMLInputElement
    expect(checkbox2).not.toBeChecked()
  })
  it("can render subfields unchecked", () => {
    const { getAllByTestId, queryByPlaceholderText } = render(<FieldGroupSubfieldsUnchecked />)
    expect(getAllByTestId("unitTest")).toHaveLength(2)
    const checkbox = getAllByTestId("unitTest")[0] as HTMLInputElement
    expect(checkbox).not.toBeChecked()
    const checkbox2 = getAllByTestId("unitTest")[1] as HTMLInputElement
    expect(checkbox2).not.toBeChecked()
    expect(queryByPlaceholderText("Enter Description")).toBeNull()
  })
  it("can render subfields checked", () => {
    const { getAllByTestId, getByPlaceholderText } = render(<FieldGroupSubfieldsChecked />)
    expect(getAllByTestId("unitTest")).toHaveLength(5)
    const checkbox = getAllByTestId("unitTest")[0] as HTMLInputElement
    expect(checkbox).toBeChecked()
    const checkbox2 = getAllByTestId("unitTest")[1] as HTMLInputElement
    expect(checkbox2).toBeChecked()
    const checkbox3 = getAllByTestId("unitTest")[2] as HTMLInputElement
    expect(checkbox3).toBeChecked()
    const checkbox4 = getAllByTestId("unitTest")[3] as HTMLInputElement
    expect(checkbox4).toBeChecked()
    const checkbox5 = getAllByTestId("unitTest")[4] as HTMLInputElement
    expect(checkbox5).toBeChecked()
    expect(getByPlaceholderText("Enter Description")).toBeTruthy()
  })
})
