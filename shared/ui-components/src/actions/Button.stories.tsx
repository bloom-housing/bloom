import * as React from "react"

import { Button } from "./Button"

export default {
  title: "Actions/Button",
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

export const filledOrPrimary = () => (
  <Button filled={true} onClick={handleClick}>
    Filled/Primary Button
  </Button>
)

export const secondary = () => (
  <Button secondary={true} onClick={handleClick}>
    Secondary Button
  </Button>
)

export const success = () => (
  <Button success={true} onClick={handleClick}>
    Success Button
  </Button>
)

export const alert = () => (
  <Button alert={true} onClick={handleClick}>
    Alert Button
  </Button>
)

export const warning = () => (
  <Button warning={true} onClick={handleClick}>
    Warning Button
  </Button>
)

export const SmallAndFilled = () => (
  <Button small={true} filled={true} onClick={handleClick}>
    Small and Filled Button
  </Button>
)

export const NormalCase = () => (
  <Button normalCase={true} onClick={handleClick}>
    Button (Normal Case)
  </Button>
)

export const borderless = () => (
  <Button borderless={true} onClick={handleClick}>
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
