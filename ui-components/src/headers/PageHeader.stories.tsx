import * as React from "react"

import { PageHeader } from "./PageHeader"

export default {
  title: "Headers/Page Header",
}

export const withTextContent = () => <PageHeader title="Hello World" />

export const withSubtitle = () => <PageHeader title="Hello World" subtitle="Here is a subtitle" />

export const withContent = () => (
  <PageHeader title="Hello World" subtitle="Here is a subtitle">
    Here is some content
  </PageHeader>
)
