import React from "react"
import { useForm } from "react-hook-form"
import { GridItem } from "./GridItem"
import { Field } from "../forms/Field"

export default {
  title: "Prototypes/GridItem",
  decorators: [(storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>],
}

export const Default = () => {
  const { register } = useForm()
  return (
    <GridItem>
      <Field label="Alpha" placeholder="Enter text" name="label1" register={register} />
    </GridItem>
  )
}

export const TwoColumns = () => {
  const { register } = useForm()
  return (
    <GridItem className="md:col-span-2">
      <Field label="Alpha" placeholder="Enter text" name="label1" register={register} />
    </GridItem>
  )
}
