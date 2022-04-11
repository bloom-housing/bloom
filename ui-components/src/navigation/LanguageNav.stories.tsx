import React from "react"

import { LanguageNav } from "./LanguageNav"
import { text, withKnobs } from "@storybook/addon-knobs"

export default {
  title: "Navigation/LanguageNav",
  decorators: [(storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>, withKnobs],
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
