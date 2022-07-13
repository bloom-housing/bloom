import React, { useState } from "react"
import { BADGES } from "../../.storybook/constants"
import MultiSelectField, {
  MultiSelectDataSourceParams,
  MultiSelectFieldItem,
} from "./MultiSelectField"
import { useForm } from "react-hook-form"
import MultiSelectFieldDocumentation from "./MultiSelectField.docs.mdx"

export default {
  title: "Forms/MultiSelect Field 🚩",
  id: "forms/multi-select-field",
  decorators: [
    (storyFn: () => JSX.Element) => (
      <div style={{ padding: "30px", maxWidth: "600px" }}>{storyFn()}</div>
    ),
  ],
  parameters: {
    docs: {
      page: MultiSelectFieldDocumentation,
    },
    badges: [BADGES.GEN2],
  },
}

const later = (delay: number) => new Promise((resolve) => setTimeout(resolve, delay))

const dataProvider: MultiSelectDataSourceParams<Promise<MultiSelectFieldItem[]>> = async (
  query,
  _render,
  isFirstCall
) => {
  if (isFirstCall && query !== "undefined") {
    return query.split(",").map((item) => {
      return {
        value: "item1",
        label: "Item 1",
      }
    })
  }

  await later(500)

  let customTypeahead =
    query.toString().length > 0
      ? [
          {
            value: "customitem",
            label: `You typed: ${query}`,
          },
        ]
      : []

  return [
    {
      value: "item1",
      label: "Item 1",
    },
    {
      value: "item2",
      label: "Another Item 2",
    },
    ...customTypeahead,
  ]
}

export const standard = () => {
  const [formOutput, setFormOutput] = useState("")
  const { register, handleSubmit, setValue, getValues } = useForm()
  const onSubmit = (data: Record<string, any>) => setFormOutput(JSON.stringify(data))

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <MultiSelectField
        dataSource={dataProvider}
        label="Select one or more items"
        placeholder="Type to search"
        id="the-value"
        name="thevalue"
        register={register}
        getValues={getValues}
        setValue={setValue}
      />
      <button type="submit" className="button">
        View Output
      </button>
      <output style={{ display: "block", marginBlockStart: "2rem" }}>{formOutput}</output>
    </form>
  )
}

export const withPreviousSelections = () => {
  const [formOutput, setFormOutput] = useState("")
  const { register, handleSubmit, getValues, setValue } = useForm({
    defaultValues: { nested: { thevalue: "item1" } },
  })
  const onSubmit = (data: Record<string, any>) => setFormOutput(JSON.stringify(data))

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <MultiSelectField
        dataSource={dataProvider}
        label="Select one or more items"
        placeholder="Type to search"
        id="the-value"
        name="nested.thevalue"
        register={register}
        getValues={getValues}
        setValue={setValue}
      />
      <button type="submit" className="button">
        View Output
      </button>
      <output style={{ display: "block", marginBlockStart: "2rem" }}>{formOutput}</output>
    </form>
  )
}
