import React, { useState } from "react"
import { Listing } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { ListingsMap } from "./ListingsMapDeprecated"
import { ListingsList } from "./ListingsListDeprecated"
import { useSwipeable } from "react-swipeable"
import styles from "./ListingsCombined.module.scss"
import deprecatedStyles from "./ListingsCombinedDeprecated.module.scss"

type ListingsCombinedProps = {
  listings: Listing[]
  currentPage: number
  lastPage: number
  onPageChange: (page: number) => void
  googleMapsApiKey: string
  loading: boolean
  listView: boolean
  setListView: React.Dispatch<React.SetStateAction<boolean>>
  isDesktop: boolean
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
      <div className={`${styles["listings-combined"]} flex-row`}>
        <div className={`${deprecatedStyles["listings-map-deprecated"]}`}>
          <ListingsMap
            listings={props.listings}
            googleMapsApiKey={props.googleMapsApiKey}
            isMapExpanded={false}
          />
        </div>
        <div
          className={`${styles["listings-map-list-container"]} ${deprecatedStyles["listings-map-list-container-list-only-deprecated"]}`}
        >
          <div
            id="listings-list-expanded"
            className={`${deprecatedStyles["listings-list-expanded-deprecated"]}`}
          >
            <div className={deprecatedStyles["swipe-area"]} {...swipeHandler}>
              <div className={deprecatedStyles["swipe-area-line"]}></div>
            </div>
            <ListingsList
              listings={props.listings}
              currentPage={props.currentPage}
              lastPage={props.lastPage}
              onPageChange={props.onPageChange}
              loading={props.loading}
            />
          </div>
        </div>
      </div>
    )
  }

  const getListingsMap = () => {
    return (
      <div className={`${styles["listings-combined"]} flex-row`}>
        <div className={styles["listings-map-expanded"]}>
          <ListingsMap
            listings={props.listings}
            googleMapsApiKey={props.googleMapsApiKey}
            isMapExpanded={true}
            setShowListingsList={setShowListingsList}
          />
        </div>
        <div className={deprecatedStyles["swipe-area-bottom"]} {...swipeHandler}>
          <div className={deprecatedStyles["swipe-area-line"]}></div>
        </div>
      </div>
    )
  }

  const getListingsCombined = () => {
    return (
      <div className={`${styles["listings-combined"]} flex-row`}>
        <div className={`${deprecatedStyles["listings-map-deprecated"]}`}>
          <ListingsMap
            listings={props.listings}
            googleMapsApiKey={props.googleMapsApiKey}
            isMapExpanded={false}
            setShowListingsList={setShowListingsList}
          />
        </div>
        <div
          id="listings-outer-container"
          className={deprecatedStyles["listings-outer-container-deprecated"]}
        >
          <div id="listings-list" className={deprecatedStyles["listings-list-deprecated"]}>
            <div className={deprecatedStyles["swipe-area"]} {...swipeHandler}>
              <div className={deprecatedStyles["swipe-area-line"]}></div>
            </div>
            <ListingsList
              listings={props.listings}
              currentPage={props.currentPage}
              lastPage={props.lastPage}
              loading={props.loading}
              onPageChange={props.onPageChange}
            />
          </div>
        </div>
      </div>
    )
  }

  let div: JSX.Element

  if (props.isDesktop) {
    div = getListingsCombined()
  } else if (showListingsList && !showListingsMap) {
    div = getListingsList()
  } else if (showListingsMap && !showListingsList) {
    div = getListingsMap()
  } else if (showListingsList && showListingsMap) {
    div = getListingsCombined()
  }

  return div
}

export { ListingsCombined as default, ListingsCombined }
