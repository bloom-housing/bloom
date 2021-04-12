import React from "react"
import { GridItem } from "./GridItem"
import { Field } from "../forms/Field"

export default {
  title: "Prototypes/GridItem",
  decorators: [(storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>],
}

export const Default = () => (
  <GridItem>
    <Field label="Alpha" placeholder="Enter text" name="label1" register={() => {}} />
  </GridItem>
)

export const TwoColumns = () => (
  <GridItem className="md:col-span-2">
    <Field label="Alpha" placeholder="Enter text" name="label1" register={() => {}} />
  </GridItem>
)
