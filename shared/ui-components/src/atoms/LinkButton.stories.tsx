import * as React from "react"
import { storiesOf } from "@storybook/react"
import LinkButton from "./LinkButton"

storiesOf("Atoms|LinkButton", module).add("default", () => (
  <LinkButton href="#">LinkButton w/Link</LinkButton>
))

storiesOf("Atoms|LinkButton", module).add("small", () => (
  <LinkButton small={true} href="#">
    Small LinkButton
  </LinkButton>
))

storiesOf("Atoms|LinkButton", module).add("filled", () => (
  <LinkButton filled={true} href="#">
    Filled LinkButton
  </LinkButton>
))

storiesOf("Atoms|LinkButton", module).add("small and filled", () => (
  <LinkButton small={true} filled={true} href="#">
    Small and Filled LinkButton
  </LinkButton>
))

storiesOf("Atoms|LinkButton", module).add("regular case", () => (
  <LinkButton normalCase={true} href="#">
    LinkButton (Normal Case)
  </LinkButton>
))
