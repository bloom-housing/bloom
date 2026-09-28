import React from "react"
import { fireEvent, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { useForm } from "react-hook-form"
import BrandColorField, { swatchValue } from "../../../src/components/settings/BrandColorField"

const Harness = ({ defaultValue, derived }: { defaultValue?: string; derived?: string }) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, setValue, errors, clearErrors, watch } = useForm({
    defaultValues: { primaryDark: defaultValue },
  })

  return (
    <BrandColorField
      name="primaryDark"
      label="Dark"
      value={watch("primaryDark")}
      derived={derived}
      register={register}
      setValue={setValue}
      errors={errors}
      clearErrors={clearErrors}
    />
  )
}

describe("BrandColorField", () => {
  it("shows the derived value as a placeholder while the field is empty", () => {
    render(<Harness derived="#693786" />)

    const input = screen.getByLabelText("Dark")
    expect(input.value).toEqual("")
    expect(input.placeholder).toEqual("#693786")
  })

  it("previews the derived value on the swatch while the field is empty", () => {
    render(<Harness derived="#693786" />)

    expect(screen.getByTestId("primaryDark-swatch").value).toEqual("#693786")
  })

  it("writes the swatch choice into the text field in upper case", () => {
    render(<Harness derived="#693786" />)

    // The swatch reports lower case; the api uppercases on save, so the field has to match.
    fireEvent.change(screen.getByTestId("primaryDark-swatch"), {
      target: { value: "#abcdef" },
    })

    expect(screen.getByLabelText("Dark").value).toEqual("#ABCDEF")
  })

  it("keeps what was typed in the text field", async () => {
    render(<Harness derived="#693786" />)

    await userEvent.type(screen.getByLabelText("Dark"), "#773E98")

    expect(screen.getByLabelText("Dark").value).toEqual("#773E98")
    expect(screen.getByTestId("primaryDark-swatch").value).toEqual("#773e98")
  })
})

// The swatch cannot render a three digit hex or an empty value, so it is resolved separately.
describe("swatchValue", () => {
  it("expands a three digit hex, which the swatch cannot take", () => {
    expect(swatchValue("#ABC")).toEqual("#AABBCC")
  })

  it("prefers the stored value over the derived one", () => {
    expect(swatchValue("#773E98", "#693786")).toEqual("#773E98")
  })

  it("falls back to the derived value when nothing is stored", () => {
    expect(swatchValue("", "#693786")).toEqual("#693786")
  })

  it("falls back to white rather than rendering a partial hex", () => {
    expect(swatchValue("#77")).toEqual("#FFFFFF")
    expect(swatchValue(undefined, undefined)).toEqual("#FFFFFF")
  })
})
