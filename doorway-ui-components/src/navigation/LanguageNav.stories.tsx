import React from "react"
import { BADGES } from "../../.storybook/constants"
import { LanguageNav } from "./LanguageNav"
import { text, withKnobs } from "@storybook/addon-knobs"

export default {
  title: "Navigation/LanguageNav 🚩",
  decorators: [(storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>, withKnobs],
  parameters: {
    badges: [BADGES.GEN2],
  },
}

export const Default = () => (
  <LanguageNav
    ariaLabel={text("ariaLabel", "")}
    languages={[
      {
        label: "English",
        active: true,
        onClick: () => {},
      },
      {
        label: "Spanish",
        active: false,
        onClick: () => {},
      },
    ]}
  />
)
