import React, { RefObject } from "react"
import { GoogleMap } from "@react-google-maps/api"
import styles from "./MapControl.module.scss"

import { Icon } from "@bloom-housing/doorway-ui-components"
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
    <div
      className={`${styles["control-style"]} ${styles["in-style"]}`}
      onClick={click}
      onKeyDown={click}
      role="button"
      tabIndex={0}
      aria-label={t("t.zoomIn")}
    >
      <Icon symbol="plus" fill={styles.controlBorderColor} size="md-large" />
    </div>
  )
}

const MapControlZoomOut = (props: MapControlProps) => {
  const click = () => {
    const m = props.mapRef.current
    const currentZoom: number = m.state.map.getZoom()
    m.state.map.setZoom(currentZoom - 1)
  }

  return (
    <div
      className={`${styles["control-style"]} ${styles["out-style"]}`}
      onClick={click}
      onKeyDown={click}
      role="button"
      tabIndex={0}
      aria-label={t("t.zoomOut")}
    >
      <Icon symbol="minus" fill={styles.controlBorderColor} size="md-large" />
    </div>
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
