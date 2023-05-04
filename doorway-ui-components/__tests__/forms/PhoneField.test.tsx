import React from "react"
import { render, cleanup } from "@testing-library/react"
import { PhoneField } from "../../src/forms/PhoneField"
import { useForm } from "react-hook-form"

afterEach(cleanup)

const DefaultPhoneField = () => {
  const { control } = useForm({ mode: "onChange" })
  return (
    <PhoneField
      id="additionalPhoneNumber"
      name="additionalPhoneNumber"
      label={"Your Second Phone Number"}
      required={true}
      caps={true}
      error={false}
      control={control}
      controlClassName="control"
    />
  )
}

const ErrorPhoneField = () => {
  const { control } = useForm({ mode: "onChange" })
  return (
    <PhoneField
      id="additionalPhoneNumber"
      name="additionalPhoneNumber"
      label={"Your Second Phone Number"}
      required={true}
      error={true}
      errorMessage={"Uh oh!"}
      control={control}
      controlClassName="control"
      readerOnly={true}
    />
  )
}

describe("<PhoneField>", () => {
  it("renders default state", () => {
    const { getByText, getByPlaceholderText } = render(<DefaultPhoneField />)
    expect(getByText("Your Second Phone Number")).toBeTruthy()
    expect(getByPlaceholderText("(555) 555-5555")).toBeTruthy()
  })
  it("renders error state", () => {
    const { getByText, getByPlaceholderText } = render(<ErrorPhoneField />)
    expect(getByText("Your Second Phone Number")).toBeTruthy()
    expect(getByPlaceholderText("(555) 555-5555")).toBeTruthy()
    expect(getByText("Uh oh!")).toBeTruthy()
  })
})
