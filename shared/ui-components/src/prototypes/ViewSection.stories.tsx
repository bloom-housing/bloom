import React from "react"
import Link from "next/link"
import { SimpleTable } from "./SimpleTable"

import "./ViewSection.scss"

export default {
  title: "Prototypes/ViewSection",
  decorators: [(storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>],
}

export const ViewSectionFourColumns = () => (
  <div className="view-section">
    <header className="view-header">
      <h2 className="view-title">My Section</h2>
    </header>

    <div className="view-grid md:grid md:grid-cols-4 md:gap-8 bg-primary-lighter">
      <p className="view-item">
        <span className="view-item__label">First Name</span>
        <span className="view-item__value">Lisa</span>
      </p>

      <p className="view-item">
        <span className="view-item__label">Middle Name</span>
        <span className="view-item__value">S</span>
      </p>

      <p className="view-item">
        <span className="view-item__label">Last Name</span>
        <span className="view-item__value">Jones</span>
      </p>

      <p className="view-item">
        <span className="view-item__label">Date of Birth</span>
        <span className="view-item__value">01/01/1985</span>
      </p>

      <p className="view-item">
        <span className="view-item__label">Email</span>
        <span className="view-item__value">lisa@gmail.com</span>
      </p>

      <p className="view-item">
        <span className="view-item__label">Phone</span>
        <span className="view-item__value">111-222-3333</span>
        <span className="view-item__helper">Cell</span>
      </p>

      <p className="view-item">
        <span className="view-item__label">Second Phone</span>
        <span className="view-item__value">222-333-4444</span>
        <span className="view-item__helper">Work</span>
      </p>

      <p className="view-item">
        <span className="view-item__label">Perferred Contact</span>
        <span className="view-item__value">Phone</span>
      </p>
    </div>
  </div>
)

export const ViewSectionFourColumnsEdit = () => (
  <div className="view-section">
    <header className="view-header">
      <h2 className="view-title">My Section</h2>
      <span className="ml-auto">
        <a className="edit-link">Edit</a>
      </span>
    </header>

    <div className="view-grid md:grid md:grid-cols-4 md:gap-8 bg-primary-lighter">
      <p className="view-item">
        <span className="view-item__label">Label</span>
        <span className="view-item__value">Value</span>
        <span className="view-item__helper">Helper</span>
      </p>

      <p className="view-item">
        <span className="view-item__label">Label</span>
        <span className="view-item__value">Value</span>
        <span className="view-item__helper">Helper</span>
      </p>

      <p className="view-item">
        <span className="view-item__label">Label</span>
        <span className="view-item__value">Value</span>
        <span className="view-item__helper">Helper</span>
      </p>

      <p className="view-item">
        <span className="view-item__label">Label</span>
        <span className="view-item__value">Value</span>
        <span className="view-item__helper">Helper</span>
      </p>

      <p className="view-item">
        <span className="view-item__label">Label</span>
        <span className="view-item__value">Value</span>
        <span className="view-item__helper">Helper</span>
      </p>

      <p className="view-item">
        <span className="info-item__label">Label</span>
        <span className="info-item__value">Value</span>
        <span className="info-item__helper">Helper</span>
      </p>

      <p className="view-item">
        <span className="info-item__label">Label</span>
        <span className="info-item__value">Value</span>
        <span className="info-item__helper">Helper</span>
      </p>

      <p className="view-item">
        <span className="info-item__label">Label</span>
        <span className="info-item__value">Value</span>
        <span className="info-item__helper">Helper</span>
      </p>
    </div>
  </div>
)

export const ViewSectionAddress = () => (
  <div className="view-section">
    <header className="view-header">
      <h2 className="view-title">My Section</h2>
    </header>

    <div className="view-grid md:grid md:grid-cols-2 md:gap-8 bg-primary-lighter">
      <div className="view-group">
        <h3 className="view-group__title">My Group</h3>
        <div className="view-subgrid md:grid md:grid-cols-4 md:gap-8">
          <p className="view-item md:col-span-2">
            <span className="view-item__label">Label</span>
            <span className="view-item__value">Value</span>
            <span className="view-item__helper">Helper</span>
          </p>

          <p className="view-item md:col-span-2">
            <span className="view-item__label">Label</span>
            <span className="view-item__value">Value</span>
            <span className="view-item__helper">Helper</span>
          </p>

          <p className="view-item md:col-span-2">
            <span className="view-item__label">Label</span>
            <span className="view-item__value">Value</span>
            <span className="view-item__helper">Helper</span>
          </p>

          <p className="view-item">
            <span className="view-item__label">Label</span>
            <span className="view-item__value">Value</span>
            <span className="view-item__helper">Helper</span>
          </p>

          <p className="view-item">
            <span className="view-item__label">Label</span>
            <span className="view-item__value">Value</span>
            <span className="view-item__helper">Helper</span>
          </p>
        </div>
      </div>
    </div>
  </div>
)

export const ViewSectionSingleColumn = () => (
  <div className="view-section">
    <h3 className="view-group__title">My Group</h3>

    <div className="view-grid md:grid md:grid-cols-1 gap-y-4 bg-primary-lighter">
      <p className="view-item">
        <span className="view-item__label">First Name</span>
        <span className="view-item__value">Lisa</span>
      </p>

      <p className="view-item">
        <span className="view-item__label">Middle Name</span>
        <span className="view-item__value">S</span>
      </p>

      <p className="view-item">
        <span className="view-item__label">Last Name</span>
        <span className="view-item__value">Jones</span>
      </p>

      <p className="view-item">
        <span className="view-item__label">Date of Birth</span>
        <span className="view-item__value">01/01/1985</span>
      </p>

      <p className="view-item">
        <span className="view-item__label">Email</span>
        <span className="view-item__value">lisa@gmail.com</span>
      </p>

      <p className="view-item">
        <span className="view-item__label">Phone</span>
        <span className="view-item__value">111-222-3333</span>
        <span className="view-item__helper">Cell</span>
      </p>

      <p className="view-item">
        <span className="view-item__label">Second Phone</span>
        <span className="view-item__value">222-333-4444</span>
        <span className="view-item__helper">Work</span>
      </p>

      <p className="view-item">
        <span className="view-item__label">Perferred Contact</span>
        <span className="view-item__value">Phone</span>
      </p>
    </div>
  </div>
)

export const ViewSectionSingleColumnWarn = () => (
  <div className="view-section">
    <p className="view-item">
      <span className="view-item__label">Application Number</span>
      <span className="view-item__value">APP-0001002002</span>
    </p>
    <div className="bg-primary-lighter my-4 p-4">
      <fieldset>
        <legend className="field-note mb-4">Confirm this application is valid:</legend>
        <div className="field-group--inline">
          <div className="field "><input type="radio" id="testvalidappkeep" name="testvalidapp" value="keep" /><label className="font-semibold" htmlFor="testvalidappkeep">Keep</label></div>
          <div className="field "><input type="radio" id="testvalidappremove" name="testvalidapp" value="remove" /><label className="font-semibold" htmlFor="testvalidappremove">Remove</label></div>
        </div>
      </fieldset>
    </div>

    <h3 className="view-group__title">My Group</h3>

    <div className="view-grid md:grid md:grid-cols-1 gap-y-4 bg-primary-lighter">
      <p className="view-item is-flagged">
        <span className="view-item__label">First Name</span>
        <span className="view-item__value">Lisa</span>
      </p>

      <p className="view-item is-flagged">
        <span className="view-item__label">Middle Name</span>
        <span className="view-item__value">S</span>
      </p>

      <p className="view-item">
        <span className="view-item__label">Last Name</span>
        <span className="view-item__value">Jones</span>
      </p>

      <p className="view-item">
        <span className="view-item__label">Date of Birth</span>
        <span className="view-item__value">01/01/1985</span>
      </p>

      <p className="view-item">
        <span className="view-item__label">Email</span>
        <span className="view-item__value">lisa@gmail.com</span>
      </p>

      <p className="view-item">
        <span className="view-item__label">Phone</span>
        <span className="view-item__value">111-222-3333</span>
        <span className="view-item__helper">Cell</span>
      </p>

      <p className="view-item">
        <span className="view-item__label">Second Phone</span>
        <span className="view-item__value">222-333-4444</span>
        <span className="view-item__helper">Work</span>
      </p>

      <p className="view-item">
        <span className="view-item__label">Perferred Contact</span>
        <span className="view-item__value">Phone</span>
      </p>
    </div>
  </div>
)


export const ViewSectionTable = () => (
  <div className="view-section">
    <header className="view-header">
      <h2 className="view-title">My Section</h2>
    </header>

    <div className="view-grid bg-primary-lighter">
      <SimpleTable />
    </div> 
  </div>
)