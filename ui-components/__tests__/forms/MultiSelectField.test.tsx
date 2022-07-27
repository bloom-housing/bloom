import React from "react"
import { fireEvent, render, cleanup, waitFor } from "@testing-library/react"
import { MultiSelectField, MultiSelectFieldItem } from "../../src/forms/MultiSelectField"
import { useForm } from "react-hook-form"

afterEach(cleanup)

const staticData: MultiSelectFieldItem[] = []
for (let i = 0; i < 10; i++) {
  staticData.push({
    value: `item${i + 1}`,
    label: `Item ${i + 1}`,
  })
}

const DefaultMultiSelectField = () => {
  const { register, getValues, setValue } = useForm({ mode: "onChange" })

  return (
    <MultiSelectField
      dataSource={staticData}
      label="Select one or more items"
      placeholder="Type to search"
      id="the-value"
      name="selectedOptions"
      register={register}
      getValues={getValues}
      setValue={setValue}
    />
  )
}

describe("<MultiSelectField>", () => {
  it("shows a dropdown list and a selected item", async () => {
    const { getByLabelText, getAllByRole, findByRole } = render(<DefaultMultiSelectField />)

    expect(getByLabelText("Select one or more items")).not.toBeNull()

    // Click the dropdown button
    const dropdownButton = await findByRole("button")
    fireEvent.click(dropdownButton)

    // Wait for results to render
    await waitFor(
      () => {
        expect(getAllByRole("option")[0]).not.toBeNull()
      },
      { timeout: 1000 }
    )

    // Click the second item in the list
    const option = getAllByRole("option")[1]
    expect(option.textContent).toEqual("Item 2")
    fireEvent.click(option)

    // Verify the item is now shown in the selected tags area
    const buttons = getAllByRole("button")
    expect(buttons.length).toBe(2)
    expect(buttons[buttons.length - 1].textContent).toEqual("Item 2")
  })
})
