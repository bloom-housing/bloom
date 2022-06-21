import React, { useRef, useEffect, useState } from "react"
import MultiSelectField from "./MultiSelectField"
import { useForm } from "react-hook-form"

export default {
  title: "Forms/MultiSelect Field",
  decorators: [
    (storyFn: () => JSX.Element) => (
      <div style={{ padding: "30px", maxWidth: "600px" }}>{storyFn()}</div>
    ),
  ],
}

const later = (delay) => new Promise((resolve) => setTimeout(resolve, delay))

export const standard = () => {
  const [formOutput, setFormOutput] = useState(null)
  const { register, handleSubmit, setValue } = useForm()
  const onSubmit = (data) => setFormOutput(JSON.stringify(data))

  const dataProvider = async (arg) => {
    console.info(arg)

    await later(500)

    let customTypeahead =
      arg.toString().length > 0
        ? [
            {
              value: "customitem",
              label: `You typed: ${arg}`,
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

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <MultiSelectField
        dataSource={dataProvider}
        label="Select Your Country"
        id="the-value"
        name="the.value"
        register={register}
        setValue={setValue}
      />
      <button type="submit" className="button">
        See Output
      </button>
      <output style={{ display: "block", marginBlockStart: "2rem" }}>{formOutput}</output>
    </form>
  )
}
