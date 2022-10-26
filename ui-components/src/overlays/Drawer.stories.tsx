import React, { useState } from "react"
import { useForm } from "react-hook-form"

import { Drawer, DrawerSide } from "./Drawer"
import { GridSection } from "../sections/GridSection"
import { ViewItem } from "../blocks/ViewItem"
import { Field } from "../forms/Field"
import { Button } from "../actions/Button"
import {
  AppearanceBorderType,
  AppearanceSizeType,
  AppearanceStyleType,
} from "../global/AppearanceTypes"

export default {
  title: "Overlays/Drawer",
  decorators: [(storyFn: any) => <div>{storyFn()}</div>],
}

export const Standard = () => {
  const [drawerState, setDrawerState] = useState(false)
  return (
    <>
      <Drawer
        open={drawerState}
        title="Drawer Title"
        onClose={() => setDrawerState(!drawerState)}
        ariaDescription="My Drawer"
        actions={[
          <Button
            key={0}
            onClick={() => setDrawerState(!drawerState)}
            styleType={AppearanceStyleType.primary}
            size={AppearanceSizeType.small}
          >
            Submit
          </Button>,
          <Button
            key={1}
            onClick={() => setDrawerState(!drawerState)}
            styleType={AppearanceStyleType.secondary}
            border={AppearanceBorderType.borderless}
            size={AppearanceSizeType.small}
          >
            Cancel
          </Button>,
        ]}
      >
        <section className="border rounded-md p-8 bg-white">
          <p>Test</p>
        </section>
      </Drawer>
      <Button
        onClick={() => {
          setDrawerState(true)
        }}
      >
        Open Drawer
      </Button>
      <div style={{ height: "1000px" }}></div>
      <div>…</div>
    </>
  )
}

export const StandardOnLeft = () => {
  const [drawerState, setDrawerState] = useState(false)
  return (
    <>
      <Drawer
        open={drawerState}
        title="Drawer Title"
        onClose={() => setDrawerState(!drawerState)}
        ariaDescription="My Drawer"
        direction={DrawerSide.left}
        actions={[
          <Button
            key={0}
            onClick={() => setDrawerState(!drawerState)}
            styleType={AppearanceStyleType.primary}
          >
            Submit
          </Button>,
          <Button
            key={1}
            onClick={() => setDrawerState(!drawerState)}
            styleType={AppearanceStyleType.secondary}
            border={AppearanceBorderType.borderless}
          >
            Cancel
          </Button>,
        ]}
      >
        <section className="border rounded-md p-8 bg-white">
          <p>Test</p>
        </section>
      </Drawer>
      <div className="text-right">
        <Button
          onClick={() => {
            setDrawerState(true)
          }}
        >
          Open Drawer
        </Button>
      </div>
    </>
  )
}

export const DrawerFieldTest = () => {
  const { register } = useForm()
  return (
    <Drawer open={true} title="Drawer Title" ariaDescription="My Drawer">
      <section className="border p-8 bg-white mb-8">
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
      </section>
    </Drawer>
  )
}

export const DrawerViewTest = () => (
  <Drawer open={true} title="Drawer Title" ariaDescription="My Drawer">
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
