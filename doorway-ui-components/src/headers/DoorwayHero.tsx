import * as React from "react"
import "./DoorwayHero.scss"

export interface DoorwayHeroProps {
  title: string
  offsetImage?: string
  offsetImageAlt?: string
  children?: React.ReactNode
}

const DoorwayHero = (props: DoorwayHeroProps) => {
  return (
    <div className="doorway-hero">
      <div className="doorway-hero_outer">
        <div className={"doorway-hero_title"}>{props.title}</div>
        <div className="doorway-hero_inner">
          {props?.offsetImage && props?.offsetImageAlt && (
            <img
              src={props.offsetImage}
              alt={props.offsetImageAlt}
              className={"rounded-3xl doorway-hero_image"}
            />
          )}
          <div className="doorway-body_container">{props?.children}</div>
        </div>
      </div>
    </div>
  )
}

export { DoorwayHero as default, DoorwayHero }
