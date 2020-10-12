import React from "react"
import Link from "next/link"
import { SimpleTable } from "./SimpleTable"
import { ViewItem } from "./ViewItem"
import { GridItem } from "./GridItem"
import { ViewSection } from "./ViewSection"

export default {
  title: "Prototypes/ViewSection",
  decorators: [(storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>],
}

export const FourColumns = () => (
  <ViewSection
    title="Section Title"
    tinted={true}
    insetGrid={true}
    className="md:grid md:grid-cols-4 md:gap-8"
  >
    <GridItem>
      <ViewItem
        label="First Name"
        children="Lisa"
      />
    </GridItem>

    <GridItem>
      <ViewItem
        label="Middle Name"
        children="S"
      />
    </GridItem>

    <GridItem>
      <ViewItem
        label="Last Name"
        children="Jones"
      />
    </GridItem>

    <GridItem>
      <ViewItem
        label="Date of Birth"
        children="01/01/1985"
      />
    </GridItem>

    <GridItem>
      <ViewItem
        label="Email"
        children="lisa@gmail.com"
      />
    </GridItem>

    <GridItem>
      <ViewItem
        label="Phone"
        children="111-222-3333"
        helper="Cell"
      />
    </GridItem>

    <GridItem>
      <ViewItem
        label="Second Phone"
        children="111-222-3333"
        helper="Work"
      />
    </GridItem>

    <GridItem>
      <ViewItem
        label="Perferred Contact"
        children="Phone"
      />
    </GridItem>
  </ViewSection>
)

export const FourColumnsEdit = () => (
  <ViewSection
    title="Section Title"
    edit="Edit"
    tinted={true}
    insetGrid={true}
    className="md:grid md:grid-cols-4 md:gap-8"
  >
    <GridItem>
      <ViewItem
        label="First Name"
        children="Lisa"
      />
    </GridItem>

    <GridItem>
      <ViewItem
        label="Middle Name"
        children="S"
      />
    </GridItem>

    <GridItem>
      <ViewItem
        label="Last Name"
        children="Jones"
      />
    </GridItem>

    <GridItem>
      <ViewItem
        label="Date of Birth"
        children="01/01/1985"
      />
    </GridItem>

    <GridItem>
      <ViewItem
        label="Email"
        children="lisa@gmail.com"
      />
    </GridItem>

    <GridItem>
      <ViewItem
        label="Phone"
        children="111-222-3333"
        helper="Cell"
      />
    </GridItem>

    <GridItem>
      <ViewItem
        label="Second Phone"
        children="111-222-3333"
        helper="Work"
      />
    </GridItem>

    <GridItem>
      <ViewItem
        label="Perferred Contact"
        children="Phone"
      />
    </GridItem>
  </ViewSection>
)

export const Address = () => (
    <ViewSection
      title="Section Title"
      tinted={true}
      insetGrid={true}
      className="md:grid md:grid-cols-1 gap-y-4"
    >

    <div className="view-group">
      <h3 className="view-group__title">Residence Address</h3>
      <div className="view-subgrid md:grid md:grid-cols-4 md:gap-8">
        <GridItem
          className="md:col-span-3"
        >
          <ViewItem
            label="Street Address"
            children="112 Springfield St."
            
          />
        </GridItem>

        <GridItem>
          <ViewItem
            label="Apt Unit #"
            children="1"
          />
        </GridItem>

        <GridItem
          className="md:col-span-2"
        >
          <ViewItem
            label="City"
            children="Oakland"
          />
        </GridItem>

        <GridItem>
          <ViewItem
            label="State"
            children="CA"
          />
        </GridItem>

        <GridItem>
          <ViewItem
            label="Zip"
            children="94577"
          />
        </GridItem>
      </div>
    </div>
  </ViewSection>
)

export const ViewSectionSingleColumn = () => (
  <ViewSection
    tinted={true}
    insetGrid={true}
  >
    <div className="view-group">
      <h3 className="view-group__title">My Group</h3>
      <div className="view-subgrid md:grid md:grid-cols-1 gap-y-4 bg-primary-lighter">
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
      </div>
    </div>
  </ViewSection>
)

export const ViewSectionSingleColumnWarn = () => (
  <ViewSection>
    <ViewItem
      label="Application Number"
      children="APP-0001002002"
    />

    <div className="view-group bg-primary-lighter my-4 p-4">
      <fieldset>
        <legend className="field-note mb-4 text-gray-750">Confirm this application is valid:</legend>
        <div className="field-group--inline">
          <div className="field "><input type="radio" id="testvalidappkeep" name="testvalidapp" value="keep" /><label className="font-semibold" htmlFor="testvalidappkeep">Keep</label></div>
          <div className="field "><input type="radio" id="testvalidappremove" name="testvalidapp" value="remove" /><label className="font-semibold" htmlFor="testvalidappremove">Remove</label></div>
        </div>
      </fieldset>
    </div>

    <div className="view-group">
      <h3 className="view-group__title">My Group</h3>
      <div className="view-subgrid p-8 md:grid md:grid-cols-1 gap-y-4 bg-primary-lighter">
        <ViewItem
          label="First Name"
          children="Lisa"
          flagged={true}
        />

        <ViewItem
          label="Middle Name"
          children="S"
          flagged={true}
        />

        <ViewItem
          label="Last Name"
          children="Jones"
          flagged={true}
        />

        <ViewItem
          label="Date of Birth"
          children="01/01/1985"
          flagged={true}
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
      </div>
    </div>
  </ViewSection>
)

export const ViewSectionTable = () => (
  <ViewSection
    title="Section Title"
    tinted={true}
    insetGrid={true}
  >
   <SimpleTable />
  </ViewSection>
)
