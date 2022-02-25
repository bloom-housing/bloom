import * as React from "react"
import { PageHeader } from "./PageHeader"
import PageHeaderDocumentation from "./PageHeader.docs.mdx"

export default {
  title: "Headers/Page Header",
  parameters: {
    docs: {
      page: PageHeaderDocumentation,
    },
  },
}

export const withTextContent = () => <PageHeader title="Hello World" />

export const withSubtitle = () => <PageHeader title="Hello World" subtitle="Here is a subtitle" />

export const inversed = () => (
  <PageHeader title="Hello Inverse World" subtitle="Here is a subtitle" inverse />
)

export const withContent = () => (
  <PageHeader title="Hello World" subtitle="Here is a subtitle">
    Here is some content
  </PageHeader>
)

export const styleOverrides = () => {
  const cssVarsOverride = `
    .style-overrides .page-header {
      --background-color: darkgreen;
      --border-color: red;
      --text-color: yellow;
      --title-font-size: 6rem;
    }
  `

  return (
    <div className="style-overrides">
      <PageHeader title="Big Title" subtitle="Here is a subtitle">
        Here is some content
      </PageHeader>
      <style>{cssVarsOverride}</style>
    </div>
  )
}
