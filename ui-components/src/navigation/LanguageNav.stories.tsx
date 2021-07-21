import React from "react"

import { LanguageNav } from "./LanguageNav"

export default {
  title: "Navigation/LanguageNav",
  decorators: [(storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>],
}

export const Default = () => (
  <LanguageNav items={[
    {
      prefix: "",
      label: "English",
    },
    {
      prefix: "es",
      label: "Spanish",
    },
  ]}/>
)
