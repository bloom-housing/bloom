import React, { useState } from "react"
import { Listing } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { ListingsMap } from "./ListingsMap"
import { ListingsList } from "./ListingsList"
import { useSwipeable } from "react-swipeable"
import styles from "./ListingsCombined.module.scss"

type ListingsCombinedProps = {
  listings: Listing[]
  currentPage: number
  lastPage: number
  onPageChange: (page: number) => void
  googleMapsApiKey: string
  loading: boolean
}

const ListingsCombined = (props: ListingsCombinedProps) => {
  const [showListingsList, setShowListingsList] = useState(true)
  const [showListingsMap, setShowListingsMap] = useState(true)

  const swipeHandler = useSwipeable({
    onSwipedUp: () => {
      if (showListingsMap) {
        if (showListingsList) {
          // This is for the combined listings page, swiping up shows the listings list page.
          setShowListingsList(true)
          setShowListingsMap(false)
          return
        } else {
          // This is for the listings map only page, swiping up shows the listings combined page.
          setShowListingsList(true)
          setShowListingsMap(true)
          return
        }
      }
    },
    onSwipedDown: () => {
      if (showListingsList) {
        if (showListingsMap) {
          // This is for the combined listings page, swiping down shows the listings map page.
          setShowListingsList(false)
          setShowListingsMap(true)
          return
        } else {
          // This is for the listings list only page, swiping up shows the listings combined page.
          setShowListingsList(true)
          setShowListingsMap(true)
          return
        }
      }
    },
    preventScrollOnSwipe: true,
  })

  const getListingsList = () => {
    return (
      <div className={styles["listings-combined"]}>
        <div className={styles["listings-map"]}>
          <ListingsMap
            listings={props.listings}
            googleMapsApiKey={props.googleMapsApiKey}
            isMapExpanded={false}
          />
        </div>
        <div className={styles["swipe-area"]} {...swipeHandler}>
          <div className={styles["swipe-area-line"]}></div>
        </div>
        <div id="listings-list-expanded" className={styles["listings-list-expanded"]}>
          <ListingsList
            listings={props.listings}
            currentPage={props.currentPage}
            lastPage={props.lastPage}
            onPageChange={props.onPageChange}
            loading={props.loading}
          ></ListingsList>
        </div>
      </div>
    )
  }

  const getListingsMap = () => {
    return (
      <div className={styles["listings-combined"]}>
        <div className={styles["listings-map-expanded"]}>
          <ListingsMap
            listings={props.listings}
            googleMapsApiKey={props.googleMapsApiKey}
            isMapExpanded={true}
            setShowListingsList={setShowListingsList}
          />
        </div>
        <div className={styles["swipe-area-bottom"]} {...swipeHandler}>
          <div className={styles["swipe-area-line"]}></div>
        </div>
      </div>
    )
  }

  const getListingsCombined = () => {
    return (
      <div className={styles["listings-combined"]}>
        <div className={styles["listings-map"]}>
          <ListingsMap
            listings={props.listings}
            googleMapsApiKey={props.googleMapsApiKey}
            isMapExpanded={false}
          />
        </div>
        <div id="listings-outer-container" className={styles["listings-outer-container"]}>
          <div className={styles["swipe-area"]} {...swipeHandler}>
            <div className={styles["swipe-area-line"]}></div>
          </div>
          <div id="listings-list" className={styles["listings-list"]}>
            <ListingsList
              listings={props.listings}
              currentPage={props.currentPage}
              lastPage={props.lastPage}
              loading={props.loading}
              onPageChange={props.onPageChange}
            ></ListingsList>
          </div>
        </div>
      </div>
    )
  }

  const hideFooter = () => {
    const footer = Array.from(
      document.getElementsByClassName("site-footer") as HTMLCollectionOf<HTMLElement>
    )[0]
    if (footer !== undefined && footer.style.display !== "none") {
      footer.style.display = "none"
    }
  }
  const showFooter = () => {
    const footer = Array.from(
      document.getElementsByClassName("site-footer") as HTMLCollectionOf<HTMLElement>
    )[0]
    if (footer !== undefined && footer.style.display == "none") {
      footer.style.display = "flex"
    }
  }

  let div: JSX.Element

  if (showListingsList && !showListingsMap) {
    div = getListingsList()
    showFooter()
  } else if (showListingsMap && !showListingsList) {
    div = getListingsMap()
    hideFooter()
  } else if (showListingsList && showListingsMap) {
    div = getListingsCombined()
    showFooter()
  }

  return div
}

export { ListingsCombined as default, ListingsCombined }
