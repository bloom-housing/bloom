import React from "react"
import { render, cleanup, fireEvent } from "@testing-library/react"
import { DOBField } from "../../src/forms/DOBField"
import { HouseholdMember } from "@bloom-housing/backend-core/types"
import { useForm } from "react-hook-form"

afterEach(cleanup)

const Required = () => {
  const { register, watch, errors } = useForm({ mode: "onChange" })
  return (
    <DOBField
      id="dateOfBirth"
      name="dateOfBirth"
      label="Date of Birth"
      required={true}
      register={register}
      watch={watch}
      error={errors?.dateOfBirth}
    />
  )
}

const Optional = () => {
  const { register, watch, errors } = useForm({ mode: "onChange" })
  return (
    <DOBField
      id="dateOfBirth"
      name="dateOfBirth"
      label="Date of Birth"
      required={false}
      register={register}
      watch={watch}
      error={errors?.dateOfBirth}
    />
  )
}

const member = ({
  birthMonth: "September",
  birthDay: "6",
  birthYear: "1994",
} as unknown) as HouseholdMember

describe("<DOBField>", () => {
  it("can render all optional props", () => {
    const { getByLabelText } = render(<Optional />)
    expect(getByLabelText("Month")).not.toBeNull()
    expect(getByLabelText("Day")).not.toBeNull()
    expect(getByLabelText("Year")).not.toBeNull()
  })
  it("required", () => {
    const { getByPlaceholderText, debug, getByDisplayValue } = render(<Required />)
    fireEvent.change(getByPlaceholderText("MM"), { target: { value: "13" } })
    expect(getByDisplayValue("13")).toBeTruthy()
    debug()
  })
  it("optional", () => {
    const { getByPlaceholderText, debug, getByDisplayValue } = render(<Optional />)
    fireEvent.change(getByPlaceholderText("MM"), { target: { value: "13" } })
    expect(getByDisplayValue("13")).toBeTruthy()
  })
})
