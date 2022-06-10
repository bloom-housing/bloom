import React from "react"

import { StandardCard } from "./StandardCard"
import { BADGES } from "../../.storybook/constants"
import { MinimalTable } from "../tables/MinimalTable"
import { Button } from "../actions/Button"
import StandardCardDocumentation from "./StandardCard.docs.mdx"
import { TableHeaders, StandardTableData } from "../tables/StandardTable"
import Icon, { IconFillColors } from "../icons/Icon"
import { faClone, faPenToSquare, faTrashCan } from "@fortawesome/free-regular-svg-icons"

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

const mockHeadersWithStyling: TableHeaders = {
  name: { name: "t.name", className: "pl-8" },
  relationship: { name: "t.relationship", className: "pl-8" },
  dob: {
    name: "application.household.member.dateOfBirth",
    className: "pl-8",
  },
  icons: { name: "", className: "pl-8" },
}

const iconContent = () => {
  return (
    <div className={"text-right mr-4 w-max"}>
      <Icon
        symbol={faPenToSquare}
        size={"medium"}
        fill={IconFillColors.primary}
        className={"mr-5"}
      />
      <Icon symbol={faClone} size={"medium"} fill={IconFillColors.primary} className={"mr-5"} />
      <Icon symbol={faTrashCan} size={"medium"} fill={IconFillColors.alert} />
    </div>
  )
}
const mockDataWithStyling: StandardTableData = [
  {
    name: { content: "Jim Halpert" },
    relationship: { content: "Husband" },
    dob: { content: "05/01/1985" },
    icons: { content: iconContent() },
  },
  {
    name: { content: "Michael Scott" },
    relationship: { content: "Friend" },
    dob: { content: "05/01/1975" },
    icons: { content: iconContent() },
  },
]

let i = 5
while (i > 0) {
  mockDataWithStyling.push(mockDataWithStyling[0])
  mockDataWithStyling.push(mockDataWithStyling[1])
  i--
}

export const WithTable = () => (
  <StandardCard
    title="Standard Card Title"
    emptyStateMessage="Add items to edit"
    footer={<Button>Add item</Button>}
  >
    <div>
      <MinimalTable
        headers={mockHeadersWithStyling}
        data={mockDataWithStyling}
        cellClassName={"py-2"}
        draggable={true}
      />
    </div>
  </StandardCard>
)

export const styleOverrides = () => {
  const cssVarsOverride = `
    .standard-card-overrides .standard-card {
      --font-family: var(--bloom-font-sans);
      --border-radius: var(--bloom-rounded-md);
      --border-width: var(--bloom-border-4);
      --border-color: var(--bloom-color-blue-600);
      --title-color: var(--bloom-color-blue-600);
      --background-color: var(--bloom-color-blue-200);
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
