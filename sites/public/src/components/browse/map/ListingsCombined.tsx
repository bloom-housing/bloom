import React from "react"
import { useApiIsLoaded } from "@vis.gl/react-google-maps"
import CustomSiteFooter from "../../shared/CustomSiteFooter"
import { ListingsSearchMetadata } from "./ListingsSearchMetadata"
import { ListingsMap } from "./ListingsMap"
import { ListingsList } from "./ListingsList"
import { useListingsMapContext } from "./ListingsMapContext"
import styles from "./ListingsCombined.module.scss"

const ListingsCombined = () => {
  const {
    googleMapsApiKey,
    googleMapsMapId,
    listView,
    isDesktop,
    isLoading,
    isFirstBoundsLoad,
    setInfoWindowIndex,
  } = useListingsMapContext()

  const apiIsLoaded = useApiIsLoaded()

  if (!apiIsLoaded) return <></>

  const getListLoading = () => {
    if (!googleMapsApiKey || !googleMapsMapId || !isLoading) return false
    return true
  }

  const getListingsList = () => {
    return (
      <div
        className={styles["listings-combined"]}
        // onClick={() => setInfoWindowIndex(null)}
        // onKeyDown={(e) => e.key === "Escape" && setInfoWindowIndex(null)}
        // role="presentation"
      >
        <ListingsSearchMetadata />
        <div
          className={`${styles["listings-map-list-container"]} ${styles["listings-map-list-container-list-only"]}`}
        >
          <div id="listings-list-expanded" className={styles["listings-list-expanded"]}>
            <ListingsList loading={getListLoading() || (isFirstBoundsLoad && isDesktop)} />
          </div>
          <div>
            <CustomSiteFooter />
          </div>
        </div>
      </div>
    )
  }

  const getListingsMap = () => {
    return (
      <div
        className={styles["listings-combined"]}
        onClick={() => setInfoWindowIndex(null)}
        onKeyDown={(e) => e.key === "Escape" && setInfoWindowIndex(null)}
        role="presentation"
      >
        <ListingsSearchMetadata />
        <div className={styles["listings-map-expanded"]}>
          <ListingsMap />
        </div>
      </div>
    )
  }

  const getListingsCombined = () => {
    return (
      <div
        className={styles["listings-combined"]}
        onClick={() => setInfoWindowIndex(null)}
        onKeyDown={(e) => e.key === "Escape" && setInfoWindowIndex(null)}
        role="presentation"
      >
        <ListingsSearchMetadata />
        <div className={styles["listings-map-list-container"]}>
          <div className={styles["listings-map"]}>
            <ListingsMap />
          </div>
          <div id="listings-outer-container" className={styles["listings-outer-container"]}>
            <div id="listings-list" className={styles["listings-list"]}>
              <ListingsList loading={getListLoading() || (isFirstBoundsLoad && isDesktop)} />
              <CustomSiteFooter />
            </div>
          </div>
        </div>
      </div>
    )
  }

  let div: React.JSX.Element

  if (!isDesktop && listView) {
    div = getListingsList()
  } else if (!isDesktop && !listView) {
    div = getListingsMap()
  } else if (isDesktop) {
    div = getListingsCombined()
  }

  return div
}

export { ListingsCombined as default, ListingsCombined }
