import * as React from "react"
import { Heading, HeaderType } from "../../../headers/Heading"

export interface SidebarBlockProps {
  children: React.ReactNode
  className?: string
  title?: string
  titlePriority?: number
  titleStyle?: HeaderType
}

const SidebarBlock = ({
  children,
  className,
  title,
  titlePriority,
  titleStyle,
}: SidebarBlockProps) => {
  return (
    <section className={`aside-block ${className ? className : ""}`}>
      {title && (
        <Heading priority={titlePriority ?? 4} style={titleStyle ?? "sidebarHeader"}>
          {title}
        </Heading>
      )}
      <div className="text-tiny text-gray-750">{children}</div>
    </section>
  )
}

export { SidebarBlock as default, SidebarBlock }
