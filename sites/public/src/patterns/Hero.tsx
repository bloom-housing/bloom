import React, { useState } from "react"
import { Heading } from "@bloom-housing/ui-seeds"
import Image from "next/image"

import MaxWidthLayout from "../layouts/max-width"
import styles from "./Hero.module.scss"

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
}

export const Hero = (props: HeroProps) => {
  const [imageExists, setImageExists] = useState(true)

  return (
    <MaxWidthLayout className={styles["hero-container"]} fullHeight={props.fullHeight}>
      <div
        className={`${styles["hero"]} ${
          props.image && imageExists ? styles["hero-with-image"] : ""
        }`}
      >
        <div>
          {props.note && <p className={styles["note"]}>{props.note}</p>}
          <Heading priority={1} className={styles["heading"]}>
            {props.title}
          </Heading>
          {props.subtitle && <p className={styles["subtitle"]}>{props.subtitle}</p>}
          <div className={styles["hero-buttons"]}>{props.action}</div>
        </div>
        {imageExists && props.image && (
          <div className={styles["hero-image"]}>
            <Image
              src={props.image}
              alt={props.imageAlt || "hero image"}
              width={500}
              height={500}
              onError={() => setImageExists(false)} // Hides component if 404 occurs
            />
          </div>
        )}
      </div>
    </MaxWidthLayout>
  )
}
