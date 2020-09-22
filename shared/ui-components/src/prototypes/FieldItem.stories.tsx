import React from "react"
import { FieldItem } from "./FieldItem"
import { Field } from "../forms/Field"

export default {
  title: "Prototypes/FieldItem",
  decorators: [(storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>],
}

export const Default = () => (
  <FieldItem
  >
    <Field
      label="Alpha"
      placeholder="Enter text"
      name="label1"
      register={() => {}}
    />
  </FieldItem>
)

export const FourColumns = () => (
  <FieldItem
    className="md:col-span-2"
  >
    <Field
      label="Alpha"
      placeholder="Enter text"
      name="label1"
      register={() => {}}
    />
  </FieldItem>
)
