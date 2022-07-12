import * as React from "react"

export interface MediaCardProps {
  title?: string
  videoURL?: string
  //   subtitle?: string
  //   externalHref?: string
  //   className?: string
  //   children: React.ReactNode
}

/**
 * @component MediaCard
 *
 * A component that renders an image with optional tags at top and status bars below it
 */
const MediaCard = (props: MediaCardProps) => (
  <div className={"media-card"}>
    <iframe
      src={props.videoURL}
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      title={props.title}
    />
  </div>
)

export { MediaCard as default, MediaCard }
