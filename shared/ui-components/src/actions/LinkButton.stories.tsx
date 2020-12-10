import * as React from "react"
import { AppearanceSizeType, AppearanceStyleType } from "../global/AppearanceTypes"

import { LinkButton } from "./LinkButton"

export default {
  title: "Actions/Link Button",
}

export const standard = () => <LinkButton href="#">LinkButton w/Link</LinkButton>

export const small = () => (
  <LinkButton size={AppearanceSizeType.small} href="#">
    Small LinkButton
  </LinkButton>
)

export const filled = () => (
  <LinkButton type={AppearanceStyleType.primary} href="#">
    Filled LinkButton
  </LinkButton>
)

export const SmallAndFilled = () => (
  <LinkButton size={AppearanceSizeType.small} type={AppearanceStyleType.primary} href="#">
    Small and Filled LinkButton
  </LinkButton>
)

export const RegularCase = () => (
  <LinkButton normalCase={true} href="#">
    LinkButton (Normal Case)
  </LinkButton>
)
