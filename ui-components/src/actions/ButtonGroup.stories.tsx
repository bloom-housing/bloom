import * as React from "react"
import { AppearanceStyleType } from "../.."
import Button from "./Button"

import { ButtonGroup, ButtonGroupSpacing } from "./ButtonGroup"

export default {
  title: "Actions/Button Group",
}

export const twoColumns = () => (
  <ButtonGroup
    columns={[
      <Button>Previous</Button>,
      <Button styleType={AppearanceStyleType.primary}>Next</Button>,
    ]}
    spacing={ButtonGroupSpacing.between}
  />
)

export const oneColumnLeft = () => (
  <ButtonGroup
    columns={[
      <>
        <Button>Previous</Button>
        <Button styleType={AppearanceStyleType.primary}>Next</Button>
      </>,
    ]}
  />
)

export const oneColumnRight = () => (
  <ButtonGroup
    columns={[
      <></>,
      <>
        <Button>Previous</Button> <Button styleType={AppearanceStyleType.primary}>Next</Button>
      </>,
    ]}
  />
)

export const oneColumnRightReversed = () => (
  <ButtonGroup
    columns={[
      <>
        <Button styleType={AppearanceStyleType.primary}>Next</Button> <Button>Previous</Button>
      </>,
    ]}
    reversed={true}
  />
)

export const oneColumnCenter = () => (
  <ButtonGroup
    columns={[
      <>
        <Button>Previous</Button> <Button styleType={AppearanceStyleType.primary}>Next</Button>
      </>,
    ]}
    spacing={ButtonGroupSpacing.even}
  />
)

export const twoColumnsFullwidthMobile = () => (
  <ButtonGroup
    columns={[
      <Button>Previous</Button>,
      <Button styleType={AppearanceStyleType.primary}>Next</Button>,
    ]}
    fullwidthMobile={true}
  />
)
