import React from "react"

import { StandardCard } from "./StandardCard"
import { BADGES } from "../../.storybook/constants"
import { MinimalTable } from "../tables/MinimalTable"
import { mockDataWithStyling, mockHeadersWithStyling } from "../tables/MinimalTable.stories"

import { Button } from "../actions/Button"
import StandardCardDocumentation from "./StandardCard.docs.mdx"

export default {
  title: "Blocks/StandardCard  🚩",
  id: "blocks/standard-card",
  decorators: [(storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>],
  component: StandardCard,
  parameters: {
    docs: {
      page: StandardCardDocumentation,
    },
    badges: [BADGES.GEN2],
  },
}

export const Blank = () => (
  <StandardCard
    title="Standard Card Title"
    emptyStateMessage="Add items to edit"
    footer={<Button>Add item</Button>}
  />
)

export const WithTable = () => (
  <StandardCard
    title="Standard Card Title"
    emptyStateMessage="Add items to edit"
    footer={<Button>Add item</Button>}
  >
    <div>
      <MinimalTable headers={mockHeadersWithStyling} data={mockDataWithStyling} draggable={true} />
    </div>
  </StandardCard>
)

export const styleOverrides = () => {
  const cssVarsOverride = `
    .standard-card-overrides .standard-card {
      --font-family: var(--bloom-font-sans);
      --border-radius: var(--bloom-rounded-md);
      --border-width: var(--bloom-border-4);
      --border-color: var(--bloom-color-blue-500);
      --title-color: var(--bloom-color-blue-500);
      --background-color: var(--bloom-color-blue-100);
      --blank-color: var(--bloom-color-black);
      --blank-background: var(--bloom-color-gray-400);
    }
  `

  return (
    <>
      <div className="standard-card-overrides">
        <StandardCard
          title="Standard Card Title"
          emptyStateMessage="Add items to edit"
          footer={<Button>Add item</Button>}
        />
        <style>{cssVarsOverride}</style>
      </div>

      <p className="mt-12 font-semibold">Customized using the following variable overrides:</p>

      <pre>{cssVarsOverride.replace(".page-header-overrides ", "")}</pre>
    </>
  )
}
