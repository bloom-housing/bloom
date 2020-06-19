import React from "react"
import { withA11y } from "@storybook/addon-a11y"
import LanguageNav from "./LanguageNav"

export default {
  title: "Prototypes|LanguageNav",
  decorators: [withA11y, (storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>],
}

export const Default = () => (
  <LanguageNav>
    <li>
      <a href="">English</a>
    </li>
    <li>
      <a href="">Spanish</a>
    </li>
    <li>
      <a href="">Chinese</a>
    </li>
    <li>
      <a href="">Vietnamese</a>
    </li>
  </LanguageNav>
)
