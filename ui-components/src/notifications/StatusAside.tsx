import React from "react"
import { GridSection } from "../sections/GridSection"

import "./StatusAside.scss"

// Ensure each action has a unique key
export interface StatusAsideProps {
  actions: React.ReactNode[]
  columns?: number
  children?: React.ReactNode
}

export const StatusAside = (props: StatusAsideProps) => (
  <div className="status-aside">
    <div className="status-aside__buttons">
      <GridSection columns={props.columns || 2} tightSpacing={true}>
        {props.actions}
      </GridSection>
    </div>

    {React.Children.count(props.children) > 0 && (
      <div className="status-aside__messages">{props.children}</div>
    )}
  </div>
)
