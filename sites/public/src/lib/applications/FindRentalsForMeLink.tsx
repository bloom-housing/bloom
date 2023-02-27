import { AppearanceSizeType } from "@bloom-housing/ui-components"
import { LinkButton } from "../../../../../detroit-ui-components/src/actions/LinkButton"
import React from "react"
import styles from "./FindRentalsForMeLink.module.scss"

const FindRentalsForMeLink = (props: { title: string }) => (
  <LinkButton className={styles.link} size={AppearanceSizeType.small} href="/eligibility/welcome">
    {props.title}
  </LinkButton>
)

export { FindRentalsForMeLink as default, FindRentalsForMeLink }
