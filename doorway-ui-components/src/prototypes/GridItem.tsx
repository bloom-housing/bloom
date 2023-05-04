import * as React from "react"

export interface GridItemProps {
  children: React.ReactNode
  className?: string
}

const GridItem = (props: GridItemProps) => {
  const gridItemClasses = ["grid-item"]
  if (props.className) gridItemClasses.push(props.className)

  return <div className={gridItemClasses.join(" ")}>{props.children}</div>
}

export { GridItem as default, GridItem }
