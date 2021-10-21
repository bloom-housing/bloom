import React from "react"
import { render, cleanup, fireEvent } from "@testing-library/react"
import { HouseholdSizeField } from "../../src/forms/HouseholdSizeField"
import { useForm } from "react-hook-form"
import { t } from "../../src/helpers/translator"

afterEach(cleanup)

const DefaultHouseholdSize = () => {
  const { register } = useForm({ mode: "onChange" })
  return (
    <HouseholdSizeField
      assistanceUrl={""}
      clearErrors={() => {}}
      error={null}
      householdSize={3}
      householdSizeMax={3}
      householdSizeMin={2}
      register={register}
      validate={true}
    />
  )
}

type ErrorHouseholdSizeProps = {
  clearErrorsSpy: jest.Mock<any, any>
}

const ErrorHouseholdSize = (props: ErrorHouseholdSizeProps) => {
  const { register } = useForm({ mode: "onChange" })
  return (
    <HouseholdSizeField
      assistanceUrl={""}
      clearErrors={props.clearErrorsSpy}
      error={{ message: "Uh oh!", type: "validate" }}
      householdSize={1}
      householdSizeMax={3}
      householdSizeMin={2}
      register={register}
      validate={true}
    />
  )
}

describe("<HouseholdSizeField>", () => {
  it("renders default state", () => {
    const { queryByText } = render(<DefaultHouseholdSize />)
    expect(queryByText("Uh oh!")).toBeNull()
    expect(queryByText(t("application.household.dontQualifyHeader"))).toBeNull()
    expect(queryByText(t("nav.getAssistance"))).toBeNull()
  })
  it("renders error state", () => {
    const clearErrorsSpy = jest.fn()
    const { getByText, getByRole } = render(<ErrorHouseholdSize clearErrorsSpy={clearErrorsSpy} />)
    expect(getByText("Uh oh!")).toBeTruthy()
    expect(getByText(t("application.household.dontQualifyHeader"))).toBeTruthy()
    expect(getByText(t("nav.getAssistance"))).toBeTruthy()
    fireEvent.click(getByRole("button"))
    expect(clearErrorsSpy).toHaveBeenCalledTimes(1)
  })
})
