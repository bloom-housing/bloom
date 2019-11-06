import * as React from "react"
import { storiesOf } from "@storybook/react"
import PageHeader from "./page_header"

storiesOf("Headers|PageHeader", module).add("with text content", () => (
  <PageHeader>Hello World</PageHeader>
))

storiesOf("Headers|PageHeader", module).add("with subtitle", () => (
  <PageHeader subtitle="Here is a subtitle">Hello World</PageHeader>
))
