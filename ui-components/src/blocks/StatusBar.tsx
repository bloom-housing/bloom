import * as React from "react"
import "./StatusBar.scss"
import { AppearanceStyleType } from "../global/AppearanceTypes"
import { Tag } from "../text/Tag"

export interface StatusBarProps {
  backButton?: React.ReactNode
  tagStyle: AppearanceStyleType
  tagLabel: string
}

const StatusBar = (props: StatusBarProps) => {
  const rowClasses = ["status-bar__row"]
  if (!props.backButton) rowClasses.push("tag-only")

  return (
    <section className="status-bar">
      <div className={rowClasses.join(" ")}>
        {props.backButton}

        <div className="status-bar__tag">
          <Tag styleType={props.tagStyle} pillStyle>
            {props.tagLabel}
          </Tag>
        </div>
      </div>
    </section>
  )
}

export { StatusBar as default, StatusBar }
