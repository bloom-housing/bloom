import * as React from "react"
import { BADGES } from "../../.storybook/constants"
import HeadingDocumentation from "./Heading.docs.mdx"
import { Heading } from "./Heading"

export default {
  title: "Text/Heading 🚩",
  id: "text/heading",
  decorators: [(storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>],
  parameters: {
    docs: {
      page: HeadingDocumentation,
    },
    badges: [BADGES.GEN2],
  },
}
export const base1 = () => <Heading>Test Header</Heading>
export const base2 = () => <Heading priority={2}>Test Header</Heading>
export const base3 = () => <Heading priority={3}>Test Header</Heading>
export const base4 = () => <Heading priority={4}>Test Header</Heading>
export const base5 = () => <Heading priority={5}>Test Header</Heading>
export const base6 = () => <Heading priority={6}>Test Header</Heading>
export const largeHeader = () => <Heading styleType={"largePrimary"}>Large Header</Heading>
export const mediumHeader = () => <Heading styleType={"mediumNormal"}>Medium Header</Heading>
export const smallWeighted = () => <Heading styleType={"smallWeighted"}>Small Weighted</Heading>
export const smallNormal = () => <Heading styleType={"smallNormal"}>Small Normal</Heading>
export const underlineHeader = () => (
  <Heading styleType={"underlineWeighted"}>Underline Header</Heading>
)
export const lightWeighted = () => <Heading styleType={"lightWeighted"}>Light Weighted</Heading>
export const capsWeighted = () => <Heading styleType={"capsWeighted"}>Caps Weighted</Heading>
