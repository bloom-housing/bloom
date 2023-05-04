import React from "react"
import { render, cleanup } from "@testing-library/react"
import { DOBField } from "../../src/forms/DOBField"
import { useForm } from "react-hook-form"

afterEach(cleanup)
// Could not figure out how to test the field validations from here given this documentation: https://react-hook-form.com/advanced-usage/#TestingForm
const Optional = ({ disabled = false }) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, watch, errors } = useForm({ mode: "onChange" })
  return (
    <DOBField
      id="dateOfBirth"
      name="dateOfBirth"
      label="Date of Birth"
      required={false}
      register={register}
      watch={watch}
      disabled={disabled || undefined}
      error={errors?.dateOfBirth}
      validateAge18={true}
    />
  )
}

describe("<DOBField>", () => {
  it("can render all optional props", () => {
    const { getByLabelText } = render(<Optional />)
    expect(getByLabelText("Month")).not.toBeNull()
    expect(getByLabelText("Day")).not.toBeNull()
    expect(getByLabelText("Year")).not.toBeNull()
  })

  it("can toggle all internal fields to be disabled", () => {
    const { container } = render(<Optional disabled={true} />)
    expect(container.querySelectorAll("input[disabled]").length).toBe(3)
  })
})
