import * as React from "react"

import { Button } from "../actions/Button"
import { AppearanceBorderType, AppearanceSizeType, AppearanceStyleType } from "../global/AppearanceTypes"

export default {
  title: "Actions/Button",
}

const handleClick = (e: React.MouseEvent) => {
  window.alert(`You clicked me! Event: ${e.type}`)
}

export const standard = () => <Button onClick={handleClick}>Button Component</Button>

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

export const primary = () => (
  <Button type={AppearanceStyleType.primary} onClick={handleClick}>
    Primary Button
  </Button>
)

export const secondary = () => (
  <Button type={AppearanceStyleType.secondary} onClick={handleClick}>
    Secondary Button
  </Button>
)

export const success = () => (
  <Button type={AppearanceStyleType.success} onClick={handleClick}>
    Success Button
  </Button>
)

export const alert = () => (
  <Button type={AppearanceStyleType.alert} onClick={handleClick}>
    Alert Button
  </Button>
)

export const warning = () => (
  <Button type={AppearanceStyleType.warning} onClick={handleClick}>
    Warning Button
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

export const successOutline = () => (
  <Button type={AppearanceStyleType.success} border={AppearanceBorderType.outlined} onClick={handleClick}>
    Outlined Success Button
  </Button>
)

export const alertOutlined = () => (
  <Button type={AppearanceStyleType.alert} border={AppearanceBorderType.outlined} onClick={handleClick}>
    Outlined Alert Button
  </Button>
)

export const warningOutline = () => (
  <Button type={AppearanceStyleType.warning} border={AppearanceBorderType.outlined} onClick={handleClick}>
    Outlined Warning Button
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
