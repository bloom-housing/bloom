import React from "react"
import { ListingsStatusEnum } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { getListingStatusTag } from "./helpers"
import styles from "./ListingStatusBar.module.scss"

export interface ListingStatusBarProps {
  className?: string
  status: ListingsStatusEnum
}

const ListingStatusBar = ({ className, status }: ListingStatusBarProps) => {
  return (
    <section className={`${styles["listing-status-bar"]} ${className ? className : ""}`}>
      <div className={styles["status-bar-inner"]}>
        <div className={styles["status-bar-content"]}>{getListingStatusTag(status)}</div>
      </div>
    </section>
  )
}

export { ListingStatusBar as default, ListingStatusBar }
