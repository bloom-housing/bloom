import * as React from "react"

import { LinkButton } from "./LinkButton"

export default {
  title: "Atoms/LinkButton",
}

export const standard = () => <LinkButton href="#">LinkButton w/Link</LinkButton>

export const small = () => (
  <LinkButton small={true} href="#">
    Small LinkButton
  </LinkButton>
)

export const filled = () => (
  <LinkButton filled={true} href="#">
    Filled LinkButton
  </LinkButton>
)

export const SmallAndFilled = () => (
  <LinkButton small={true} filled={true} href="#">
    Small and Filled LinkButton
  </LinkButton>
)

export const RegularCase = () => (
  <LinkButton normalCase={true} href="#">
    LinkButton (Normal Case)
  </LinkButton>
)
