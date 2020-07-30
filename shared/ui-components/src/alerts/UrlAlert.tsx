import React, { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { AlertBox } from "./AlertBox"
import { AlertTypes } from "./alertTypes"

type UrlAlertProps = {
  urlParam?: string
  timeout?: number
  dismissable?: boolean
  type?: AlertTypes
  className?: string
}

/**
 * Show an alert based on a url query param.
 */
export const UrlAlert = ({
  urlParam = "message",
  timeout,
  dismissable = true,
  type = "alert",
  className,
}: UrlAlertProps) => {
  const [open, setOpen] = useState(false)

  const router = useRouter()
  const {
    query: { [urlParam]: message },
  } = router

  useEffect(() => {
    let timeoutRef: number
    if (message) {
      setOpen(true)

      // Automatically dismiss the message after the timeout, if applicable
      if (timeout) {
        timeoutRef = (setTimeout(() => setOpen(false), timeout) as unknown) as number
      }
    }
    return () => clearTimeout(timeoutRef)
  }, [message, timeout])

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
