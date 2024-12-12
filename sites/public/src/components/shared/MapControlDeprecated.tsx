import React, { RefObject } from "react"
import { GoogleMap } from "@react-google-maps/api"
import styles from "./MapControl.module.scss"
import { Icon } from "@bloom-housing/ui-seeds"
import PlusIcon from "@heroicons/react/24/solid/PlusIcon"
import MinusIcon from "@heroicons/react/24/solid/MinusIcon"

import { t } from "@bloom-housing/ui-components"

export interface MapControlProps {
  mapRef: RefObject<GoogleMap>
}

const MapControlZoomIn = (props: MapControlProps) => {
  const click = () => {
    const m = props.mapRef.current
    const currentZoom: number = m.state.map.getZoom()
    m.state.map.setZoom(currentZoom + 1)
  }
  return (
    <button
      className={`${styles["control-style"]} ${styles["in-style"]}`}
      onClick={click}
      aria-label={t("t.zoomIn")}
    >
      <Icon size="lg" className={styles["control-icon"]}>
        <PlusIcon />
      </Icon>
    </button>
  )
}

const MapControlZoomOut = (props: MapControlProps) => {
  const click = () => {
    const m = props.mapRef.current
    const currentZoom: number = m.state.map.getZoom()
    m.state.map.setZoom(currentZoom - 1)
  }

  return (
    <button
      className={`${styles["control-style"]} ${styles["out-style"]}`}
      onClick={click}
      aria-label={t("t.zoomOut")}
    >
      <Icon size="lg" className={styles["control-icon"]}>
        <MinusIcon />
      </Icon>
    </button>
  )
}

const MapControl = (props: MapControlProps) => {
  return (
    <div aria-label={t("t.mapControls")} role="group" className={styles["map-control"]}>
      <MapControlZoomIn mapRef={props.mapRef} />
      <MapControlZoomOut mapRef={props.mapRef} />
    </div>
  )
}

export { MapControl as default, MapControl }
