import React from "react"
import { Heading } from "@bloom-housing/ui-seeds"
import MaxWidthLayout from "../layouts/max-width"
import styles from "./Hero.module.scss"

export interface HeroProps {
  /** A clear call to action, most typically a button */
  action: React.ReactNode
  /** Optional text shown above the heading */
  note?: string
  /** Text shown beneath the heading */
  subtitle?: string
  /** Main heading text */
  title: string
}

export const Hero = (props: HeroProps) => {
  return (
    <MaxWidthLayout className={styles["hero-container"]}>
      <div className={styles["hero"]}>
        {props.note && <p className={styles["note"]}>{props.note}</p>}
        <Heading priority={1} className={styles["heading"]}>
          {props.title}
        </Heading>
        {props.subtitle && <p className={styles["subtitle"]}>{props.subtitle}</p>}
        <div className={styles["hero-buttons"]}>{props.action}</div>
      </div>
    </MaxWidthLayout>
  )
}
