import React from "react"
import { render, cleanup } from "@testing-library/react"
import { DateField } from "../../src/forms/DateField"
import { useForm } from "react-hook-form"

afterEach(cleanup)
const Optional = ({ disabled = false }) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, watch, errors } = useForm({ mode: "onChange" })
  return (
    <DateField
      id="appDueDate"
      name="appDueDate"
      label="Application Due Date"
      required={false}
      register={register}
      watch={watch}
      disabled={disabled || undefined}
      error={errors?.appDueDate}
    />
  )
}

describe("<DateField>", () => {
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
