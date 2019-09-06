import * as React from "react"
import { storiesOf } from "@storybook/react"
import Button from "./Button"

const handleClick = (e: React.MouseEvent) => {
  alert("You clicked me!")
}

storiesOf("Atoms|Button", module).add("default", () => (
  <Button onClick={handleClick}>Button Component</Button>
))

storiesOf("Atoms|Button", module).add("small", () => (
  <Button small={true} onClick={handleClick}>
    Small Button
  </Button>
))

storiesOf("Atoms|Button", module).add("filled", () => (
  <Button filled={true} onClick={handleClick}>
    Filled Button
  </Button>
))

storiesOf("Atoms|Button", module).add("small and filled", () => (
  <Button small={true} filled={true} onClick={handleClick}>
    Small and Filled Button
  </Button>
))

storiesOf("Atoms|Button", module).add("regular case", () => (
  <Button normalCase={true} onClick={handleClick}>
    Button (Normal Case)
  </Button>
))
