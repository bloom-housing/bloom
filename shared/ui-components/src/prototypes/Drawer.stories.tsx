import React from "react"
import { Icon } from "../icons/Icon"
import SVG from "react-inlinesvg"

import { Drawer } from "./Drawer"
import { FieldSection } from "./FieldSection"
import { GridSection, GridCell } from "../sections/GridSection"
import { ViewItem } from "../blocks/ViewItem"
import { Field } from "../forms/Field"

export default {
  title: "Prototypes/Drawer",
  decorators: [
    (storyFn: any) => (
      <div>
        {storyFn()}
        <SVG src="/images/icons.svg" />
      </div>
    ),
  ],
}

export const Standard = () => (
  <Drawer title="Drawer Title" className="is-right" ariaDescription="My Drawer">
    <section className="border rounded-md p-8 bg-white mb-8">
      <p>Test</p>
    </section>
  </Drawer>
)

export const HasBackground = () => (
  <Drawer title="Drawer Title" className="is-right" ariaDescription="My Drawer" hasBackdrop={true}>
    <section className="border rounded-md p-8 bg-white mb-8">
      <p>Test</p>
    </section>
  </Drawer>
)

export const DrawerFieldTest = () => (
  <Drawer title="Drawer Title" className="is-right" ariaDescription="My Drawer">
    <section className="border p-8 bg-white mb-8">
      <FieldSection title="Section Title" className="md:grid md:grid-cols-4 md:gap-8">
        <Field label="Alpha" placeholder="Enter text" name="label1" register={() => {}} />

        <Field label="Beta" placeholder="Enter text" name="label2" register={() => {}} />

        <Field label="Gamma" placeholder="Enter text" name="label3" register={() => {}} />

        <Field label="Delta" placeholder="Enter text" name="label4" register={() => {}} />

        <Field label="Epsilon" placeholder="Enter text" name="label5" register={() => {}} />

        <Field label="Zeta" placeholder="Enter text" name="label6" register={() => {}} />

        <Field label="Eta" placeholder="Enter text" name="label7" register={() => {}} />

        <Field label="Theta" placeholder="Enter text" name="label8" register={() => {}} />
      </FieldSection>
    </section>
  </Drawer>
)

export const DrawerViewTest = () => (
  <Drawer title="Drawer Title" className="is-right" ariaDescription="My Drawer">
    <section className="border rounded-md p-8 bg-white mb-8">
      <GridSection title="Section Title" tinted={true} inset={true} columns={4}>
        <ViewItem label="First Name" children="Lisa" />

        <ViewItem label="Middle Name" children="S" />

        <ViewItem label="Last Name" children="Jones" />

        <ViewItem label="Date of Birth" children="01/01/1985" />

        <ViewItem label="Email" children="lisa@gmail.com" />

        <ViewItem label="Phone" children="111-222-3333" helper="Cell" />

        <ViewItem label="Second Phone" children="111-222-3333" helper="Work" />

        <ViewItem label="Perferred Contact" children="Phone" />
      </GridSection>
    </section>
  </Drawer>
)
