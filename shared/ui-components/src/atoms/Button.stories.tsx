import * as React from "react"
import { withA11y } from "@storybook/addon-a11y"
import Button from "./Button"

export default {
  title: "Atoms|Button",
  decorators: [withA11y],
}

const handleClick = (e: React.MouseEvent) => {
  alert(`You clicked me! Event: ${e.type}`)
}

export const standard = () => <Button onClick={handleClick}>Button Component</Button>

export const small = () => (
  <Button small={true} onClick={handleClick}>
    Small Button
  </Button>
)

export const big = () => (
  <Button big={true} onClick={handleClick}>
    Big Button
  </Button>
)

export const filled = () => (
  <Button filled={true} onClick={handleClick}>
    Filled Button
  </Button>
)

export const SmallAndFilled = () => (
  <Button small={true} filled={true} onClick={handleClick}>
    Small and Filled Button
  </Button>
)

export const RegularCase = () => (
  <Button normalCase={true} onClick={handleClick}>
    Button (Normal Case)
  </Button>
)

// TODO: replace with tailwind markup, if it matters
export const inaccessible = () => (
  <button style={{ backgroundColor: "red", color: "darkRed" }}>Inaccessible button</button>
)
