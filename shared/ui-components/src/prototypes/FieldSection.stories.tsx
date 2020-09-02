import React from "react"
import { Field, t } from "@bloom-housing/ui-components"

import "./FieldSection.scss"

export default {
  title: "Prototypes/FieldSection",
  decorators: [(storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>],
}

export const FieldFieldSectionFourColumns = () => (
  <div className="field-section">
    <header className="field-section__header">
      <h2 className="field-section__title">My Section</h2>
    </header>  

    <div className="field-grid md:grid md:grid-cols-4 md:gap-8 demo">
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

export const FieldFieldGroupAddress = () => (
  <div className="field-section">
    <header className="field-section__header">
      <h2 className="field-section__title">My Section</h2>
    </header>  

    <div className="field-grid md:grid md:grid-cols-4 md:gap-8 demo">
      <div className="field-group md:col-span-3">
        <h3 className="field-group__title">My Group</h3>
        <div className="field-subgrid md:grid md:grid-cols-6 md:gap-8">
          <div className="field md:col-span-4">
            <label className="label">Label</label>
            <div className="control">
              <input className="input" placeholder="Enter text" />
            </div>
          </div>

          <div className="field md:col-span-2">
            <label className="label">Label</label>
            <div className="control">
              <input className="input" placeholder="Enter text" />
            </div>
          </div>

          <div className="field md:col-span-2">
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
    </div>
  </div>
)
