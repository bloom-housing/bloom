import React from "react"
import { Heading } from "@bloom-housing/ui-seeds"
import MaxWidthLayout from "../layouts/max-width"
import styles from "./Hero.module.scss"
import { HeadingSize } from "@bloom-housing/ui-seeds/src/text/Heading"

export interface HeroProps {
  /** A clear call to action, most typically a button */
  action: React.ReactNode
  /** If the hero should take the full height of the viewport */
  fullHeight?: boolean
  image?: string
  imageAlt?: string
  /** Optional text shown above the heading */
  note?: string
  /** Text shown beneath the heading */
  subtitle?: string
  /** Main heading text */
  title: string
  titleSize?: HeadingSize
}

export const Hero = (props: HeroProps) => {
  const headingSize = props.titleSize || ("6xl" as HeadingSize)

  return (
    <MaxWidthLayout className={styles["hero-container"]} fullHeight={props.fullHeight}>
      <div className={styles["hero-with-image"]}>
        <div className={`${styles["hero"]}`}>
          {props.note && <p className={styles["note"]}>{props.note}</p>}
          <Heading priority={1} size={headingSize} className={styles["heading"]}>
            {props.title}
          </Heading>
          {props.subtitle && <p className={styles["subtitle"]}>{props.subtitle}</p>}
          <div className={styles["hero-buttons"]}>{props.action}</div>
        </div>
        {props.image && (
          <div className={styles["hero-image"]}>
            <img src={props.image} alt={props.imageAlt || "hero image"} />
          </div>
        )}
      </div>
    </MaxWidthLayout>
  )
}
