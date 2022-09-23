import * as React from "react"
import { Heading, HeadingProps } from "../../../text/Heading"

export interface SidebarBlockProps extends Omit<HeadingProps, "children" | "className"> {
  children: React.ReactNode
  className?: string
  title?: string
}

const SidebarBlock = ({ children, className, title, priority, style }: SidebarBlockProps) => {
  return (
    <section className={`aside-block ${className ? className : ""}`}>
      {title && (
        <Heading priority={priority ?? 4} style={style ?? "underlineWeighted"}>
          {title}
        </Heading>
      )}
      <div className="text-tiny text-gray-750">{children}</div>
    </section>
  )
}

export { SidebarBlock as default, SidebarBlock }
