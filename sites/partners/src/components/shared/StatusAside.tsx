import React from "react"
import styles from "./StatusAside.module.scss"
import { Grid } from "@bloom-housing/ui-seeds"

// Ensure each action has a unique key
export interface StatusAsideProps {
  actions: React.ReactNode[]
  columns?: number
  children?: React.ReactNode
}

export const StatusAside = (props: StatusAsideProps) => (
  <div>
    <div className={styles["status-aside__buttons"]}>
      <Grid>
        <Grid.Row columns={props.columns || 2}>{props.actions}</Grid.Row>
      </Grid>
    </div>

    {React.Children.count(props.children) > 0 && <div>{props.children}</div>}
  </div>
)
