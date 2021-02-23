import * as React from "react"
import { AppearanceSizeType, AppearanceStyleType } from "../global/AppearanceTypes"

import { LinkButton } from "./LinkButton"

export default {
  title: "Actions/Link Button",
}

export const standard = () => <LinkButton href="/standardButtonLink">LinkButton w/Link</LinkButton>

export const small = () => (
  <LinkButton size={AppearanceSizeType.small} href="/smallButtonLink">
    Small LinkButton
  </LinkButton>
)

export const filled = () => (
  <LinkButton styleType={AppearanceStyleType.primary} href="/filledButtonLink">
    Filled LinkButton
  </LinkButton>
)

export const SmallAndFilled = () => (
  <LinkButton
    size={AppearanceSizeType.small}
    styleType={AppearanceStyleType.primary}
    href="/smallFilledButtonLink"
  >
    Small and Filled LinkButton
  </LinkButton>
)

export const RegularCase = () => (
  <LinkButton normalCase={true} href="/regularButtonLink">
    LinkButton (Normal Case)
  </LinkButton>
)
