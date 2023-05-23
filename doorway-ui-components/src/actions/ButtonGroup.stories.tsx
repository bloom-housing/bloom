import * as React from "react"
import { BADGES } from "../../.storybook/constants"
import { AppearanceSizeType, AppearanceStyleType, Icon } from "../.."
import Button from "./Button"
import ButtonGroupDocumentation from "./ButtonGroup.docs.mdx"

import { ButtonGroup, ButtonGroupSpacing } from "./ButtonGroup"

export default {
  title: "Actions/Button Group 🚩",
  id: "actions-button-group",
  parameters: {
    docs: {
      page: ButtonGroupDocumentation,
    },
    badges: [BADGES.GEN2],
  },
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

export const oneColumnReversed = () => (
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
      <>
        <Button>Previous</Button>
        <Button styleType={AppearanceStyleType.warning}>Another Action</Button>
      </>,
      <Button styleType={AppearanceStyleType.primary}>Next</Button>,
    ]}
    fullwidthMobile={true}
  />
)

export const pagination = () => (
  <ButtonGroup
    pagination={true}
    columns={[
      <Button>
        <Icon
          className="button__icon"
          size="small"
          symbol="arrowBack"
        />
      </Button>,
      <Button>8</Button>,
      <Button styleType={AppearanceStyleType.primary}>9</Button>,
      <Button>10</Button>,
      <Button>11</Button>,
      <Button>12</Button>,
      <Button>
        <Icon
          className="button__icon"
          size="small"
          symbol="arrowForward"
        />
      </Button>,
    ]}
  />
)
