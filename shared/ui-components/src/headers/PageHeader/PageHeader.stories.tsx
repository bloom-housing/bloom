import * as React from "react"
import { withA11y } from "@storybook/addon-a11y"
import PageHeader from "./PageHeader"

export default {
  title: "Headers|PageHeader",
  decorators: [withA11y],
}

export const withTextContent = () => <PageHeader>Hello World</PageHeader>

export const withSubtitle = () => <PageHeader subtitle="Here is a subtitle">Hello World</PageHeader>
