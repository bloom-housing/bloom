import React from "react"
import { useForm } from "react-hook-form"
import { MinimalTable } from "@bloom-housing/ui-components"
import { ViewItem } from "../blocks/ViewItem"
import { GridSection, GridCell } from "./GridSection"
import { Field } from "../forms/Field"
import { Button } from "../actions/Button"
import { AppearanceStyleType } from "../global/AppearanceTypes"
import { mockData, mockHeaders } from "../tables/StandardTable.stories"

export default {
  title: "Sections/Grid Section",
  decorators: [(storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>],
}

export const DefaultThreeColumns = () => (
  <GridSection title="Section Title" subtitle="Subsection Title">
    <GridCell>
      <ViewItem label="First Name" children="Lisa" />
    </GridCell>

    <GridCell>
      <ViewItem label="Middle Name" children="S" />
    </GridCell>

    <GridCell>
      <ViewItem label="Last Name" children="Jones" />
    </GridCell>

    <GridCell>
      <ViewItem label="Date of Birth" children="01/01/1985" />
    </GridCell>

    <GridCell>
      <ViewItem label="Email" children="lisa@gmail.com" />
    </GridCell>

    <GridCell>
      <ViewItem label="Phone" children="111-222-3333" helper="Cell" />
    </GridCell>

    <GridCell>
      <ViewItem label="Second Phone" children="111-222-3333" helper="Work" />
    </GridCell>

    <GridCell>
      <ViewItem label="Perferred Contact" children="Phone" />
    </GridCell>
  </GridSection>
)

export const TwoColumns = () => (
  <GridSection title="Section Title" columns={2}>
    <GridCell>
      <ViewItem label="First Name" children="Lisa" />
    </GridCell>

    <GridCell>
      <ViewItem label="Middle Name" children="S" />
    </GridCell>

    <GridCell>
      <ViewItem label="Last Name" children="Jones" />
    </GridCell>

    <GridCell>
      <ViewItem label="Date of Birth" children="01/01/1985" />
    </GridCell>
  </GridSection>
)

export const FourColumnsEdit = () => (
  <GridSection
    title="Very Long Section Title That Wraps on Mobile"
    subtitle="Subsection Title"
    columns={4}
    edit="Edit"
    tinted={true}
    inset={true}
  >
    <GridCell>
      <ViewItem label="First Name" children="Lisa" />
    </GridCell>

    <GridCell>
      <ViewItem label="Middle Name" children="S" />
    </GridCell>

    <GridCell>
      <ViewItem label="Last Name" children="Jones" />
    </GridCell>

    <GridCell>
      <ViewItem label="Date of Birth" children="01/01/1985" />
    </GridCell>

    <GridCell>
      <ViewItem label="Email" children="lisa@gmail.com" />
    </GridCell>

    <GridCell>
      <ViewItem label="Phone" children="111-222-3333" helper="Cell" />
    </GridCell>

    <GridCell>
      <ViewItem label="Second Phone" children="111-222-3333" helper="Work" />
    </GridCell>

    <GridCell>
      <ViewItem label="Perferred Contact" children="Phone" />
    </GridCell>
  </GridSection>
)

export const FourColumnsFields = () => {
  const { register } = useForm()

  return (
    <GridSection title="Section Title" columns={4}>
      <Field label="Alpha" placeholder="Enter text" name="label1" register={register} />

      <Field label="Beta" placeholder="Enter text" name="label2" register={register} />

      <Field label="Gamma" placeholder="Enter text" name="label3" register={register} />

      <Field label="Delta" placeholder="Enter text" name="label4" register={register} />

      <Field label="Epsilon" placeholder="Enter text" name="label5" register={register} />

      <Field label="Zeta" placeholder="Enter text" name="label6" register={register} />

      <Field label="Eta" placeholder="Enter text" name="label7" register={register} />

      <Field label="Theta" placeholder="Enter text" name="label8" register={register} />
    </GridSection>
  )
}

export const Address = () => (
  <GridSection title="Section Title" tinted={true} inset={true} grid={false} className="gap-y-4">
    <GridSection subtitle="Residence Address" columns={4}>
      <GridCell span={3}>
        <ViewItem label="Street Address" children="112 Springfield St." />
      </GridCell>

      <GridCell>
        <ViewItem label="Apt Unit #" children="1" />
      </GridCell>

      <GridCell span={2}>
        <ViewItem label="City" children="Oakland" />
      </GridCell>

      <GridCell>
        <ViewItem label="State" children="CA" />
      </GridCell>

      <GridCell>
        <ViewItem label="Zip" children="94577" />
      </GridCell>
    </GridSection>

    <GridSection subtitle="Work Address" columns={4}>
      <GridCell span={3}>
        <ViewItem label="Street Address" children="112 Springfield St." />
      </GridCell>

      <GridCell>
        <ViewItem label="Apt Unit #" children="1" />
      </GridCell>

      <GridCell span={2}>
        <ViewItem label="City" children="Oakland" />
      </GridCell>

      <GridCell>
        <ViewItem label="State" children="CA" />
      </GridCell>

      <GridCell>
        <ViewItem label="Zip" children="94577" />
      </GridCell>
    </GridSection>
  </GridSection>
)

export const AddressFields = () => {
  const { register } = useForm()

  return (
    <GridSection title="Section Title" grid={false} className="mt-8">
      <GridSection title="My Group" columns={6}>
        <GridCell span={4}>
          <Field
            label="Street Address"
            placeholder="Enter text"
            name="label1"
            register={register}
          />
        </GridCell>

        <GridCell span={2}>
          <Field label="Address 2" placeholder="Enter text" name="label2" register={register} />
        </GridCell>

        <GridCell span={2}>
          <Field label="City" placeholder="Enter text" name="label3" register={register} />
        </GridCell>

        <Field label="State" placeholder="Enter text" name="label4" register={register} />

        <Field label="Zip" placeholder="Enter text" name="label5" register={register} />
      </GridSection>
    </GridSection>
  )
}

export const GridSectionSingleColumn = () => (
  <GridSection tinted={true} grid={false} inset={true}>
    <GridSection subtitle="My Group" columns={1} className="md:gap-y-2">
      <GridCell>
        <ViewItem label="First Name" children="Lisa" />
      </GridCell>

      <GridCell>
        <ViewItem label="Middle Name" children="S" />
      </GridCell>

      <GridCell>
        <ViewItem label="Last Name" children="Jones" />
      </GridCell>

      <GridCell>
        <ViewItem label="Date of Birth" children="01/01/1985" />
      </GridCell>

      <GridCell>
        <ViewItem label="Email" children="lisa@gmail.com" />
      </GridCell>

      <GridCell>
        <ViewItem label="Phone" children="111-222-3333" helper="Cell" />
      </GridCell>

      <GridCell>
        <ViewItem label="Second Phone" children="111-222-3333" helper="Work" />
      </GridCell>

      <GridCell>
        <ViewItem label="Preferred Contact" children="Phone" />
      </GridCell>
    </GridSection>
  </GridSection>
)

export const GridSectionSingleColumnWarn = () => (
  <GridSection grid={false}>
    <ViewItem label="Application Number" children="APP-0001002002" />

    <GridSection grid={false} tinted={true}>
      <div className="my-4 p-4">
        <fieldset>
          <legend className="field-note mb-4 text-gray-750">
            Confirm this application is valid:
          </legend>
          <div className="field-group--inline">
            <div className="field ">
              <input type="radio" id="testvalidappkeep" name="testvalidapp" value="keep" />
              <label className="font-semibold" htmlFor="testvalidappkeep">
                Keep
              </label>
            </div>
            <div className="field ">
              <input type="radio" id="testvalidappremove" name="testvalidapp" value="remove" />
              <label className="font-semibold" htmlFor="testvalidappremove">
                Remove
              </label>
            </div>
          </div>
        </fieldset>
      </div>
    </GridSection>

    <GridSection subtitle="My Group" columns={1} inset={true} tinted={true} className="md:gap-y-4">
      <GridCell>
        <ViewItem label="First Name" children="Lisa" flagged={true} />
      </GridCell>

      <GridCell>
        <ViewItem label="Middle Name" children="S" flagged={true} />
      </GridCell>

      <GridCell>
        <ViewItem label="Last Name" children="Jones" flagged={true} />
      </GridCell>

      <GridCell>
        <ViewItem label="Date of Birth" children="01/01/1985" flagged={true} />
      </GridCell>

      <GridCell>
        <ViewItem label="Email" children="lisa@gmail.com" />
      </GridCell>

      <GridCell>
        <ViewItem label="Phone" children="111-222-3333" helper="Cell" />
      </GridCell>

      <GridCell>
        <ViewItem label="Second Phone" children="111-222-3333" helper="Work" />
      </GridCell>

      <ViewItem label="Preferred Contact" children="Phone" />
    </GridSection>
  </GridSection>
)

export const GridSectionTable = () => (
  <GridSection title="Section Title" grid={false} tinted={true} inset={true}>
    <MinimalTable headers={mockHeaders} data={mockData} />
  </GridSection>
)

export const ButtonGrid = () => (
  <GridSection columns={2} tightSpacing={true}>
    <GridCell>
      <Button fullWidth={true}>I'm a Button!</Button>
    </GridCell>
    <GridCell>
      <Button fullWidth={true}>Another Button</Button>
    </GridCell>
    <GridCell span={2}>
      <Button styleType={AppearanceStyleType.primary} fullWidth={true}>
        I'm a Button!
      </Button>
    </GridCell>
  </GridSection>
)
