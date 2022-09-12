import * as React from "react"
import { BADGES } from "../../.storybook/constants"
import TextStylesDocumentation from "./TextStyles.docs.mdx"

export default {
  title: "Text/Text Styles 🚩",
  id: "text/tstyles",
  decorators: [(storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>],
  parameters: {
    docs: {
      page: TextStylesDocumentation,
    },
    badges: [BADGES.GEN2],
  },
}

export const largeHeader = () => (
  <span className={"text__large-header"}>Large Header Text Style</span>
)
export const mediumHeader = () => (
  <span className={"text__medium-header"}>Medium Header Text Style</span>
)
export const smallWeighted = () => (
  <span className={"text__small-weighted"}>Small Weighted Text Style</span>
)
export const smallNormal = () => (
  <span className={"text__small-normal"}>Small Normal Text Style</span>
)
export const underlineHeader = () => (
  <span className={"text__underline-header"}>Underline Header Text Style</span>
)
export const lightWeighted = () => (
  <span className={"text__light-weighted"}>Light Weighted Text Style</span>
)
export const capsWeighted = () => (
  <span className={"text__caps-weighted"}>Caps Weighted Text Style</span>
)
export const fieldLabel = () => <span className={"text__field-label"}>Field Label Text Style</span>
