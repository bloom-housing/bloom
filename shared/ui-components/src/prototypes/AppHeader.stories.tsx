import React from "react"
import { withA11y } from "@storybook/addon-a11y"
import "./AppHeader.scss"
import ProgressNav from "./ProgressNav"

export default {
  title: "Prototypes|AppHeader",
  decorators: [withA11y, (storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>]
}

export const AppHeader = () => (
  <div className="app-header">
    <header className="app-header_group">
      <h1 className="app-header_title">Application: 123 Main St.</h1>
    </header>
    <div className="app-header_nav">
      <ProgressNav />
    </div>
  </div>
)