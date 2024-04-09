import * as React from "react"
import dayjs from "dayjs"
import { Message } from "@bloom-housing/ui-seeds"
import styles from "./AlertBanner.module.scss"

export type AlertBannerProps = {
  children: React.ReactNode
  maintenanceWindow?: string
  variant?: "primary" | "alert"
}

const AlertBanner = ({ children, maintenanceWindow, variant }: AlertBannerProps) => {
  const getInMaintenance = () => {
    let inMaintenance = false
    const maintenanceWindowSplit = maintenanceWindow?.split(",")
    if (maintenanceWindowSplit?.length === 2) {
      const convertWindowToDate = (windowString: string) =>
        dayjs(windowString, "YYYY-MM-DD HH:mm Z")
      const startWindow = convertWindowToDate(maintenanceWindowSplit[0])
      const endWindow = convertWindowToDate(maintenanceWindowSplit[1])
      const now = dayjs()
      inMaintenance = now > startWindow && now < endWindow
    }
    return inMaintenance
  }

  return (
    getInMaintenance() && (
      <div className={styles["site-alert-banner-container"]} data-variant={variant}>
        <Message className={styles["site-alert-banner-content"]} variant={variant}>
          <>{children}</>
        </Message>
      </div>
    )
  )
}

export { AlertBanner as default, AlertBanner }
