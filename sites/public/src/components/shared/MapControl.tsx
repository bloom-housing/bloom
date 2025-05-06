import React from "react"
import { useMap } from "@vis.gl/react-google-maps"
import PlusIcon from "@heroicons/react/24/solid/PlusIcon"
import MinusIcon from "@heroicons/react/24/solid/MinusIcon"
import { Icon } from "@bloom-housing/ui-seeds"
import styles from "./MapControl.module.scss"
import { t } from "@bloom-housing/ui-components"

type MapControlProps = {
  setInfoWindowIndex?: React.Dispatch<React.SetStateAction<number>>
}

const MapControl = (props: MapControlProps) => {
  const map = useMap()

  if (!map) return null

  return (
    <div aria-label={t("t.mapControls")} role="group" className={styles["map-control"]}>
      <button
        className={`${styles["control-style"]} ${styles["in-style"]}`}
        onClick={() => {
          map.setZoom(map.getZoom() + 1)
          if (props.setInfoWindowIndex) props.setInfoWindowIndex(null)
        }}
        aria-label={t("t.zoomIn")}
        data-testid="map-zoom-in"
      >
        <Icon size="lg" className={styles["control-icon"]}>
          <PlusIcon />
        </Icon>
      </button>
      <button
        className={`${styles["control-style"]} ${styles["out-style"]}`}
        onClick={() => {
          map.setZoom(map.getZoom() - 1)
          if (props.setInfoWindowIndex) props.setInfoWindowIndex(null)
        }}
        aria-label={t("t.zoomOut")}
        data-testid="map-zoom-out"
      >
        <Icon size="lg" className={styles["control-icon"]}>
          <MinusIcon />
        </Icon>
      </button>
    </div>
  )
}

export { MapControl as default, MapControl }
