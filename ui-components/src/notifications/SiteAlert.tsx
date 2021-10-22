import React, { useEffect, useState } from "react"
import { AlertBox } from "./AlertBox"
import { AlertTypes } from "./alertTypes"

type SiteAlertProps = {
  timeout?: number
  dismissable?: boolean
  type?: AlertTypes
  className?: string
}

export const setSiteAlertMessage = (message: string, type: AlertTypes) => {
  sessionStorage.setItem(`alert_message_${type}`, message)
}

export const clearSiteAlertMessage = (type: AlertTypes) => {
  sessionStorage.removeItem(`alert_message_${type}`)
}

/**
 * Show an alert based on a url query param.
 */
export const SiteAlert = ({
  timeout,
  dismissable = true,
  type = "alert",
  className,
}: SiteAlertProps) => {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    let timeoutRef: number
    const storedMessage = sessionStorage.getItem(`alert_message_${type}`)

    if (storedMessage) {
      setMessage(storedMessage)
      setOpen(true)
      sessionStorage.removeItem(`alert_message_${type}`)

      // Automatically dismiss the message after the timeout, if applicable
      if (timeout) {
        timeoutRef = (setTimeout(() => setOpen(false), timeout) as unknown) as number
      }
    }
    return () => clearTimeout(timeoutRef)
  }, [timeout, type])

  return open ? (
    <AlertBox
      onClose={dismissable ? () => setOpen(false) : undefined}
      className={className}
      type={type}
    >
      {message}
    </AlertBox>
  ) : null
}
