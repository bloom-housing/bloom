import React from "react"
import { GridSection } from "@bloom-housing/ui-components"
import styles from "./StatusAside.module.scss"

// Ensure each action has a unique key
export interface StatusAsideProps {
  actions: React.ReactNode[]
  columns?: number
  children?: React.ReactNode
}

export const StatusAside = (props: StatusAsideProps) => (
  <div>
    <div className={styles["status-aside__buttons"]}>
      <GridSection columns={props.columns || 2} tightSpacing={true}>
        {props.actions}
      </GridSection>
    </div>

    {React.Children.count(props.children) > 0 && <div>{props.children}</div>}
  </div>
)
