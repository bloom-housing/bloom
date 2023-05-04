import React, { useEffect, useState } from "react"
import { AlertBox } from "./AlertBox"
import { AlertTypes } from "./alertTypes"

type SiteAlertProps = {
  timeout?: number
  dismissable?: boolean
  type?: AlertTypes
  className?: string
  alertMessage?: {
    type: AlertTypes
    message: string
  }
  sticky?: boolean
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
  alertMessage,
  sticky,
}: SiteAlertProps) => {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState("")
  /**
    * We use 2 useEffects here 1 for if we are consuming what is stored in sessionStorage
    * and another for if the message is passed in as a prop

    * this gives the ability for the SiteAlert to "survive" a re-render, or if no re-render will occur 
    * for the SiteAlert to simply render itself
  **/

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

  useEffect(() => {
    let timeoutRef: number
    if (alertMessage?.message) {
      setMessage(alertMessage?.message)
      setOpen(true)
      if (timeout) {
        timeoutRef = (setTimeout(() => setOpen(false), timeout) as unknown) as number
      }
    }
    return () => clearTimeout(timeoutRef)
  }, [alertMessage, timeout])

  return open ? (
    <AlertBox
      onClose={dismissable ? () => setOpen(false) : undefined}
      className={className}
      type={alertMessage?.type ?? type}
      sticky={sticky}
    >
      {message}
    </AlertBox>
  ) : null
}
