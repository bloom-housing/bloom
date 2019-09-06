import * as React from "react"
import { storiesOf } from "@storybook/react"
import Button from "./Button"

storiesOf("Atoms|Button", module).add("default", () => <Button href="#">Button w/Link</Button>)

storiesOf("Atoms|Button", module).add("small", () => (
  <Button small={true} href="#">
    Small Button
  </Button>
))

storiesOf("Atoms|Button", module).add("filled", () => (
  <Button filled={true} href="#">
    Filled Button
  </Button>
))

storiesOf("Atoms|Button", module).add("small and filled", () => (
  <Button small={true} filled={true} href="#">
    Small and Filled Button
  </Button>
))

storiesOf("Atoms|Button", module).add("regular case", () => (
  <Button normalCase={true} href="#">
    Button (Normal Case)
  </Button>
))
