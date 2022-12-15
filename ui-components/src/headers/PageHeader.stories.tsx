import * as React from "react"
import { BADGES } from "../../.storybook/constants"
import { PageHeader } from "./PageHeader"
import PageHeaderDocumentation from "./PageHeader.docs.mdx"

export default {
  title: "Headers/Page Header 🚩",
  id: "headers/page-header",
  parameters: {
    docs: {
      page: PageHeaderDocumentation,
    },
    badges: [BADGES.GEN2],
  },
}

export const withTextContent = () => <PageHeader title="Hello World" />

export const withSubtitle = () => <PageHeader title="Hello World" subtitle="Here is a subtitle" />

export const withJustSubtitle = () => <PageHeader subtitle="Here is a subtitle" />

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
    .page-header-overrides .page-header {
      --background-color: darkgreen;
      --border-color: red;
      --text-color: yellow;
      --title-font-size: 6rem;
    }
  `

  return (
    <>
      <div className="page-header-overrides">
        <PageHeader title="Big Title" subtitle="Here is a subtitle">
          Here is some contenta
        </PageHeader>
        <style>{cssVarsOverride}</style>
      </div>

      <p className="mt-12 font-semibold">Customized using the following variable overrides:</p>

      <pre>{cssVarsOverride.replace(".page-header-overrides ", "")}</pre>
    </>
  )
}
