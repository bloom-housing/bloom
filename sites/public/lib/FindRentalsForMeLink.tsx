import { AppearanceSizeType, LinkButton, t } from "@bloom-housing/ui-components"
import React from "react"
import styles from "../lib/FindRentalsForMeLink.module.scss"

const FindRentalsForMeLink = (props: { title: string }) => (
  <LinkButton className={styles.link} size={AppearanceSizeType.small} href="/eligibility/welcome">
    {props.title}
  </LinkButton>
)

export { FindRentalsForMeLink as default, FindRentalsForMeLink }
