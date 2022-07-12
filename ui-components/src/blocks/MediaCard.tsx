import * as React from "react"

export interface MediaCardProps {
  title?: string
  //   subtitle?: string
  //   externalHref?: string
  //   className?: string
  //   children: React.ReactNode
}

const MediaCard = (props: MediaCardProps) => <div>{props.title}</div>

export { MediaCard as default, MediaCard }
