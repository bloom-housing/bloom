import * as React from "react"

import { withKnobs, text, select } from "@storybook/addon-knobs"

import { Button } from "../actions/Button"
import {
  AppearanceBorderType,
  AppearanceSizeType,
  AppearanceStyleType,
} from "../global/AppearanceTypes"

export default {
  title: "Actions/Button",
  decorators: [withKnobs],
}

const handleClick = (e: React.MouseEvent) => {
  alert(`You clicked me! Event: ${e.type}`)
}

const StyleTypeStory = { ...AppearanceStyleType, default: undefined }
const BorderTypeStory = { ...AppearanceBorderType, default: undefined }

export const standard = () => {
  const styleSelect = select("Appearance Style", StyleTypeStory, undefined)
  const borderSelect = select("Appearance Border", BorderTypeStory, undefined)

  return (
    <Button type={styleSelect} border={borderSelect} onClick={handleClick}>
      {text("Label", "Hello Storybook")}
    </Button>
  )
}

export const small = () => (
  <Button size={AppearanceSizeType.small} onClick={handleClick}>
    Small Button
  </Button>
)

export const big = () => (
  <Button size={AppearanceSizeType.big} onClick={handleClick}>
    Big Button
  </Button>
)

export const SmallAndPrimary = () => (
  <Button size={AppearanceSizeType.small} type={AppearanceStyleType.primary} onClick={handleClick}>
    Small and Primary Button
  </Button>
)

export const NormalCase = () => (
  <Button normalCase={true} onClick={handleClick}>
    Button (Normal Case)
  </Button>
)

export const NormalCaseAndSuccess = () => (
  <Button normalCase={true} type={AppearanceStyleType.success} onClick={handleClick}>
    Button (Normal Case)
  </Button>
)

export const borderless = () => (
  <Button border={AppearanceBorderType.borderless} onClick={handleClick}>
    Borderless Button
  </Button>
)

export const unstyled = () => (
  <Button unstyled={true} onClick={handleClick}>
    Unstyled Button
  </Button>
)

// TODO: replace with tailwind markup, if it matters
export const inaccessible = () => (
  <button style={{ backgroundColor: "red", color: "darkRed" }}>Inaccessible button</button>
)
