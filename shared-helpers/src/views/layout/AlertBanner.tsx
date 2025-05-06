import * as React from "react"
import dayjs from "dayjs"
import { Message } from "@bloom-housing/ui-seeds"
import styles from "./AlertBanner.module.scss"

export type AlertBannerProps = {
  children: React.ReactNode
  windowEnv?: string
  variant?: "primary" | "alert"
}

const AlertBanner = ({ children, windowEnv, variant }: AlertBannerProps) => {
  const isMessageActive = () => {
    let isActive = false
    const messageWindow = windowEnv?.split(",")
    if (messageWindow?.length === 2) {
      const convertWindowToDate = (windowString: string) =>
        dayjs(windowString, "YYYY-MM-DD HH:mm Z")
      const startWindow = convertWindowToDate(messageWindow[0])
      const endWindow = convertWindowToDate(messageWindow[1])
      const now = dayjs()
      isActive = now > startWindow && now < endWindow
    }
    return isActive
  }

  return (
    isMessageActive() && (
      <div className={styles["site-alert-banner-container"]} data-variant={variant}>
        <Message className={styles["site-alert-banner-content"]} variant={variant}>
          <>{children}</>
        </Message>
      </div>
    )
  )
}

export { AlertBanner as default, AlertBanner }
