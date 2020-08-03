import React from "react"

import LanguageNav from "./LanguageNav"

export default {
  title: "Prototypes/LanguageNav",
  decorators: [(storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>],
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
