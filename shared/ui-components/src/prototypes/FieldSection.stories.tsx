import React from "react"
import { Field, t } from "@bloom-housing/ui-components"
import { SimpleTable } from "./SimpleTable"
import { FieldSection } from "./FieldSection"

export default {
  title: "Prototypes/FieldSection",
  decorators: [(storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>],
}

export const FourColumns = () => (
  <FieldSection
    title="Section Title"
    tinted={true}
    className="md:grid md:grid-cols-4 md:gap-8"
  >
    <div className="field">
      <label className="label" htmlFor="field-1">Label</label>
      <div className="control">
        <input className="input" id="field-1" placeholder="Enter text" />
      </div>
    </div>

    <div className="field">
      <label className="label" htmlFor="field-2">Label</label>
      <div className="control">
        <input className="input" id="field-2" placeholder="Enter text" />
      </div>
    </div>

    <div className="field">
      <label className="label" htmlFor="field-3">Label</label>
      <div className="control">
        <input className="input" id="field-3" placeholder="Enter text" />
      </div>
    </div>

    <div className="field">
      <label className="label" htmlFor="field-4">Label</label>
      <div className="control">
        <input className="input" id="field-4" placeholder="Enter text" />
      </div>
    </div>

    <div className="field">
      <label className="label" htmlFor="field-5">Label</label>
      <div className="control">
        <input className="input" id="field-5" placeholder="Enter text" />
      </div>
    </div>

    <div className="field">
      <label className="label" htmlFor="field-6">Label</label>
      <div className="control">
        <input className="input" id="field-6" placeholder="Enter text" />
      </div>
    </div>

    <div className="field">
      <label className="label" htmlFor="field-7">Label</label>
      <div className="control">
        <input className="input" id="field-7" placeholder="Enter text" />
      </div>
    </div>

    <div className="field">
      <label className="label" htmlFor="field-8">Label</label>
      <div className="control">
        <input className="input" id="field-8" placeholder="Enter text" />
      </div>
    </div>
  </FieldSection>
)

export const FieldGroupAddress = () => (
  <div className="field-section">
    <header className="field-section__header">
      <h2 className="field-section__title">My Section</h2>
    </header>  

    <div className="field-grid md:grid md:grid-cols-4 md:gap-8">
      <div className="field-group md:col-span-3">
        <h3 className="field-group__title">My Group</h3>
        <div className="field-subgrid md:grid md:grid-cols-6 md:gap-8">
          <div className="field md:col-span-4">
            <label className="label" htmlFor="field-0">Address 1</label>
            <div className="control">
              <input className="input" id="field-0" placeholder="Enter text" />
            </div>
          </div>

          <div className="field md:col-span-2">
            <label className="label" htmlFor="field-1">Address 2</label>
            <div className="control">
              <input className="input" id="field-1" placeholder="Enter text" />
            </div>
          </div>

          <div className="field md:col-span-2">
            <label className="label" htmlFor="field-2">City</label>
            <div className="control">
              <input className="input" id="field-2" placeholder="Enter text" />
            </div>
          </div>

          <div className="field">
            <label className="label" htmlFor="field-3">State</label>
            <div className="control">
              <input className="input" id="field-3" placeholder="Enter text" />
            </div>
          </div>

          <div className="field">
            <label className="label" htmlFor="field-4">Zip</label>
            <div className="control">
              <input className="input" id="field-4" placeholder="Enter text" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)

export const FieldSectionTable = () => (
  <div className="field-section">
    <header className="field-section__header">
      <h2 className="field-section__title">My Section</h2>
    </header>

    <div className="field-grid bg-primary-lighter mb-4">
      <SimpleTable />
    </div> 

    <button className="button is-small">Add Household Member</button>
  </div>
)

export const FieldSectionBlank = () => (
  <div className="field-section">
    <header className="field-section__header">
      <h2 className="field-section__title">My Section</h2>
    </header>

    <div className="field-grid bg-primary-lighter p-8">
      <button className="button is-small">Add Household Member</button>
    </div> 
  </div>
)