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
      <div className="doorway-hero_inner">
        <h1>{props.title}</h1>
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
  )
}

export { DoorwayHero as default, DoorwayHero }
