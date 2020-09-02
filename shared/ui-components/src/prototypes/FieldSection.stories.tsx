import React from "react"
import { Field, t } from "@bloom-housing/ui-components"
import { SimpleTable } from "./SimpleTable"

import "./FieldSection.scss"

export default {
  title: "Prototypes/FieldSection",
  decorators: [(storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>],
}

export const FieldSectionFourColumns = () => (
  <div className="field-section">
    <header className="field-section__header">
      <h2 className="field-section__title">My Section</h2>
    </header>  

    <div className="field-grid md:grid md:grid-cols-4 md:gap-8">
      <div className="field">
        <label className="label">Label</label>
        <div className="control">
          <input className="input" placeholder="Enter text" />
        </div>
      </div>

      <div className="field">
        <label className="label">Label</label>
        <div className="control">
          <input className="input" placeholder="Enter text" />
        </div>
      </div>

      <div className="field">
        <label className="label">Label</label>
        <div className="control">
          <input className="input" placeholder="Enter text" />
        </div>
      </div>

      <div className="field">
        <label className="label">Label</label>
        <div className="control">
          <input className="input" placeholder="Enter text" />
        </div>
      </div>

      <div className="field">
        <label className="label">Label</label>
        <div className="control">
          <input className="input" placeholder="Enter text" />
        </div>
      </div>

      <div className="field">
        <label className="label">Label</label>
        <div className="control">
          <input className="input" placeholder="Enter text" />
        </div>
      </div>

      <div className="field">
        <label className="label">Label</label>
        <div className="control">
          <input className="input" placeholder="Enter text" />
        </div>
      </div>

      <div className="field">
        <label className="label">Label</label>
        <div className="control">
          <input className="input" placeholder="Enter text" />
        </div>
      </div>
    </div>
  </div>
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
            <label className="label">Address 1</label>
            <div className="control">
              <input className="input" placeholder="Enter text" />
            </div>
          </div>

          <div className="field md:col-span-2">
            <label className="label">Address 2</label>
            <div className="control">
              <input className="input" placeholder="Enter text" />
            </div>
          </div>

          <div className="field md:col-span-2">
            <label className="label">City</label>
            <div className="control">
              <input className="input" placeholder="Enter text" />
            </div>
          </div>

          <div className="field">
            <label className="label">State</label>
            <div className="control">
              <input className="input" placeholder="Enter text" />
            </div>
          </div>

          <div className="field">
            <label className="label">Zip</label>
            <div className="control">
              <input className="input" placeholder="Enter text" />
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