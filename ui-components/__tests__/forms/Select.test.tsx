import React from "react"
import { render, cleanup } from "@testing-library/react"
import { Select } from "../../src/forms/Select"
import { useForm } from "react-hook-form"

afterEach(cleanup)

const ethnicityKeys = ["hispanicLatino", "notHispanicLatino"]

const DefaultSelect = () => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register } = useForm({ mode: "onChange" })
  return (
    <Select
      id="application.demographics.ethnicity"
      name="application.demographics.ethnicity"
      placeholder={"Select One"}
      label={"Ethnicity"}
      labelClassName="sr-only"
      register={register}
      controlClassName="control"
      options={ethnicityKeys}
      keyPrefix="application.review.demographics.ethnicityOptions"
    />
  )
}

const ErrorSelect = () => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register } = useForm({ mode: "onChange" })
  return (
    <Select
      name="application.demographics.ethnicity"
      placeholder={"Select One"}
      label={"Ethnicity"}
      labelClassName="sr-only"
      register={register}
      controlClassName="control"
      options={ethnicityKeys}
      keyPrefix="application.review.demographics.ethnicityOptions"
      error={true}
      errorMessage={"Uh oh!"}
      describedBy={"Ethnicity"}
    />
  )
}

describe("<Select>", () => {
  it("renders default state", () => {
    const { getByText } = render(<DefaultSelect />)
    expect(getByText("Ethnicity")).toBeTruthy()
    expect(getByText("Select One")).toBeTruthy()
    expect(getByText("Hispanic / Latino")).toBeTruthy()
    expect(getByText("Not Hispanic / Latino")).toBeTruthy()
  })
  it("renders with an error", () => {
    const { getByText } = render(<ErrorSelect />)
    expect(getByText("Ethnicity")).toBeTruthy()
    expect(getByText("Select One")).toBeTruthy()
    expect(getByText("Hispanic / Latino")).toBeTruthy()
    expect(getByText("Not Hispanic / Latino")).toBeTruthy()
    expect(getByText("Uh oh!")).toBeTruthy()
  })
})
