import React from "react"
import { useForm } from "react-hook-form"
import { FieldSection } from "./FieldSection"
import { GridItem } from "./GridItem"
import { Field } from "../forms/Field"

export default {
  title: "Prototypes/FieldSection",
  decorators: [(storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>],
}

export const FourColumns = () => {
  const { register } = useForm()
  return (
    <FieldSection title="Section Title" className="md:grid md:grid-cols-4 md:gap-8">
      <Field label="Alpha" placeholder="Enter text" name="label1" register={register} />

      <Field label="Beta" placeholder="Enter text" name="label2" register={register} />

      <Field label="Gamma" placeholder="Enter text" name="label3" register={register} />

      <Field label="Delta" placeholder="Enter text" name="label4" register={register} />

      <Field label="Epsilon" placeholder="Enter text" name="label5" register={register} />

      <Field label="Zeta" placeholder="Enter text" name="label6" register={register} />

      <Field label="Eta" placeholder="Enter text" name="label7" register={register} />

      <Field label="Theta" placeholder="Enter text" name="label8" register={register} />
    </FieldSection>
  )
}

export const FieldGroupAddress = () => {
  const { register } = useForm()

  return (
    <FieldSection title="Section Title" className="md:grid md:grid-cols-4 md:gap-8">
      <div className="field-group md:col-span-3">
        <h3 className="field-group__title">My Group</h3>
        <div className="field-subgrid md:grid md:grid-cols-6 md:gap-8">
          <GridItem className="md:col-span-4">
            <Field
              label="Street Address"
              placeholder="Enter text"
              name="label1"
              register={register}
            />
          </GridItem>

          <GridItem className="md:col-span-2">
            <Field label="Address 2" placeholder="Enter text" name="label2" register={register} />
          </GridItem>

          <GridItem className="md:col-span-2">
            <Field label="City" placeholder="Enter text" name="label3" register={register} />
          </GridItem>

          <Field label="State" placeholder="Enter text" name="label4" register={register} />

          <Field label="Zip" placeholder="Enter text" name="label5" register={register} />
        </div>
      </div>
    </FieldSection>
  )
}

export const FieldSectionBlank = () => (
  <FieldSection title="Section Title" tinted={true} insetGrid={true}>
    <button className="button is-small">Add Household Member</button>
  </FieldSection>
)
