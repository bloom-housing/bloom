import React, { useState } from "react"
import { Button } from "./Button"
import { faAngleUp, faAngleDown } from "@fortawesome/free-solid-svg-icons"
import "./ExpandableContent.scss"

type ExpandableContentProps = {
  children: React.ReactChild
  strings: {
    readMore?: string
    readLess?: string
  }
  className?: string
}

const ExpandableContent = ({ children, strings, className }: ExpandableContentProps) => {
  const [isExpanded, setExpanded] = useState(false)
  const classNames = ["expandable-content"]
  if (className) classNames.push(...className.split(" "))

  return (
    <div className={classNames.join(" ")}>
      {isExpanded && <div>{children}</div>}
      <Button
        className="expandable-content__button"
        unstyled={true}
        inlineIcon="right"
        icon={isExpanded ? faAngleUp : faAngleDown}
        iconSize="small"
        onClick={() => {
          setExpanded(!isExpanded)
        }}
      >
        {isExpanded ? strings.readLess : strings.readMore}
      </Button>
    </div>
  )
}

export { ExpandableContent as default, ExpandableContent }
