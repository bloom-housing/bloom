import React from "react"
import { render, cleanup, fireEvent, screen } from "@testing-library/react"
import { DateField } from "../../src/forms/DateField"
import { useForm } from "react-hook-form"
import { act } from "react-dom/test-utils"

afterEach(cleanup)
// Could not figure out how to test the field validations from here given this documentation: https://react-hook-form.com/advanced-usage/#TestingForm
const Date = ({ disabled = false }) => {
  const { register, watch, errors } = useForm({ mode: "onChange" })
  return (
    <DateField
      id="applicationDueDate"
      name="applicationDueDate"
      label="Application Due Date"
      required={false}
      register={register}
      watch={watch}
      disabled={disabled || undefined}
      error={errors?.applicationDueDate}
    />
  )
}

describe("<DateField>", () => {
  it("can render all optional props", () => {
    const { getByLabelText } = render(<Date />)
    expect(getByLabelText("Month")).not.toBeNull()
    expect(getByLabelText("Day")).not.toBeNull()
    expect(getByLabelText("Year")).not.toBeNull()
  })

  it("can toggle all internal fields to be disabled", () => {
    const { container } = render(<Date disabled={true} />)
    expect(container.querySelectorAll("input[disabled]").length).toBe(3)
  })
})
