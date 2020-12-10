import React from "react"
import { GridSection } from "../sections/GridSection"

import "./StatusAside.scss"

export interface StatusAsideProps {
  actions: React.ReactNode[]
  children: React.ReactNode
}

export const StatusAside = (props: StatusAsideProps) => (
  <div className="status-aside">
    <div className="status-aside__buttons">
      <GridSection columns={2} tightSpacing={true}>
        {props.actions}
      </GridSection>
    </div>

    <div className="status-aside__messages">
      <h3 className="status-aside__title">Status History</h3>
      {props.children}
    </div>
  </div>
)
