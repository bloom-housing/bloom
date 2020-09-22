import * as React from "react"

export interface GridItemProps {
  children: React.ReactNode
  className?: string
}

const GridItem = (props: GridItemProps) => {
  const gridItemClasses = ["field-item"]
  if (props.className) gridItemClasses.push(props.className)

  return (
    <div className={gridItemClasses.join(" ")}>
      {props.children}
    </div>
  )
}

export { GridItem as default, GridItem }
