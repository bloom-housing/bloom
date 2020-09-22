import React from "react"
import SVG from "react-inlinesvg"

import { Drawer } from "./Drawer"
import { FieldSection } from "./FieldSection"
import { ViewSection } from "./ViewSection"
import { ViewItem } from "./ViewItem"

export default {
  title: "Prototypes/Drawer",
  decorators: [(storyFn: any) => <div>{storyFn()}<SVG src="/images/icons.svg" /></div>],
}

export const Standard = () => (
  <Drawer
    title="Drawer Title"
    className="is-right"
    ariaDescription="My Drawer"
  >
    <section className="border p-8 bg-white mb-8">
      <p>Test</p>
    </section>
  </Drawer> 
)

export const HasBackground = () => (
  <Drawer
    title="Drawer Title"
    className="is-right has-backdrop"
    ariaDescription="My Drawer"
    hasBackdrop={true}
  >
    <section className="border p-8 bg-white mb-8">
      <p>Test</p>
    </section>
  </Drawer> 
)

export const DrawerFieldTest = () => (
  <Drawer
    title="Drawer Title"
    className="is-right"
    ariaDescription="My Drawer"
  >
    <section className="border p-8 bg-white mb-8">
      <FieldSection
        title="Section Title"
        className="md:grid md:grid-cols-4 md:gap-8"
      >
        <div className="field">
          <label className="label" htmlFor="field-1">Label</label>
          <div className="control">
            <input className="input" id="field-1" name="field-1" placeholder="Enter text" />
          </div>
        </div>

        <div className="field">
          <label className="label" htmlFor="field-2">Label</label>
          <div className="control">
            <input className="input" id="field-2" name="field-2" placeholder="Enter text" />
          </div>
        </div>

        <div className="field">
          <label className="label" htmlFor="field-3">Label</label>
          <div className="control">
            <input className="input" id="field-3" name="field-3" placeholder="Enter text" />
          </div>
        </div>

        <div className="field">
          <label className="label" htmlFor="field-4">Label</label>
          <div className="control">
            <input className="input" id="field-4" name="field-4" placeholder="Enter text" />
          </div>
        </div>

        <div className="field">
          <label className="label" htmlFor="field-5">Label</label>
          <div className="control">
            <input className="input" id="field-5" name="field-5" placeholder="Enter text" />
          </div>
        </div>

        <div className="field">
          <label className="label" htmlFor="field-6">Label</label>
          <div className="control">
            <input className="input" id="field-6" name="field-6" placeholder="Enter text" />
          </div>
        </div>

        <div className="field">
          <label className="label" htmlFor="field-7">Label</label>
          <div className="control">
            <input className="input" id="field-7" name="field-7" placeholder="Enter text" />
          </div>
        </div>

        <div className="field">
          <label className="label" htmlFor="field-8">Label</label>
          <div className="control">
            <input className="input" id="field-8" name="field-8" placeholder="Enter text" />
          </div>
        </div>
      </FieldSection>
    </section>
  </Drawer> 
)

export const DrawerViewTest = () => (
  <Drawer
    title="Drawer Title"
    className="is-right"
    ariaDescription="My Drawer"
  >
    <section className="border p-8 bg-white mb-8">
      <ViewSection
        title="Section Title"
        tinted={true}
        className="md:grid md:grid-cols-4 md:gap-8"
      >
        <ViewItem
            label="First Name"
            children="Lisa"
          />

          <ViewItem
            label="Middle Name"
            children="S"
          />

          <ViewItem
            label="Last Name"
            children="Jones"
          />

          <ViewItem
            label="Date of Birth"
            children="01/01/1985"
          />

          <ViewItem
            label="Email"
            children="lisa@gmail.com"
          />

          <ViewItem
            label="Phone"
            children="111-222-3333"
            helper="Cell"
          />

          <ViewItem
            label="Second Phone"
            children="111-222-3333"
            helper="Work"
          />

          <ViewItem
            label="Perferred Contact"
            children="Phone"
          />
      </ViewSection>
    </section>
  </Drawer>
)
