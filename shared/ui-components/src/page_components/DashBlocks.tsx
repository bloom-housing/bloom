import React from "react"
import "./DashBlocks.scss"

const DashBlocks = (props: { children: JSX.Element | JSX.Element[] }) => (
  <div className="dash-blocks">{props.children}</div>
)
export { DashBlocks as default, DashBlocks }
