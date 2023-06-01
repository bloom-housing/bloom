import React from "react"
import { Listing } from "@bloom-housing/backend-core/types"
import { ListingsMap } from "./ListingsMap"
import { ListingsList } from "./ListingsList"
import styles from "./ListingsCombined.module.scss"

type ListingsCombinedProps = {
  listings: Listing[]
  currentPage: number
  lastPage: number
  onPageChange: (page: number) => void
  googleMapsApiKey: string
}

const ListingsCombined = (props: ListingsCombinedProps) => {
  return (
    <div className={styles["listings-combined"]}>
      <ListingsMap listings={props.listings} googleMapsApiKey={props.googleMapsApiKey} />
      <div className={styles["listings-list"]}>
        <ListingsList
          listings={props.listings}
          currentPage={props.currentPage}
          lastPage={props.lastPage}
          onPageChange={props.onPageChange}
        ></ListingsList>
      </div>
    </div>
  )
}
export { ListingsCombined as default, ListingsCombined }
