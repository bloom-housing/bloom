import React, { FunctionComponent, useContext, useEffect, useState } from "react"
import { useRouter } from "next/router"
import UserContext from "./UserContext"
import { ConfigContext } from "../config"
import { Modal } from "../modals/Modal"
import { t } from "../helpers/translator"

const events = ["mousemove", "keypress", "scroll"]

function useIdleTimeout(timeoutMs: number, onTimeout: () => void) {
  useEffect(() => {
    let timer: number
    const restartTimer = () => {
      if (timer) {
        clearTimeout(timer)
      }
      timer = (setTimeout(onTimeout, timeoutMs) as unknown) as number
    }

    // Listen for any activity events & reset the timer when they are found
    if (typeof document !== "undefined") {
      events.forEach((event) => document.addEventListener(event, restartTimer, false))
    }

    // Clean up our listeners & clear the timeout on unmounting/updating the effect
    return () => {
      if (timer) {
        clearTimeout(timer)
      }
      events.forEach((event) => document.removeEventListener(event, restartTimer, false))
    }
  }, [timeoutMs, onTimeout])
}

export const IdleTimeout: FunctionComponent = ({ children }) => {
  const { idleTimeout } = useContext(ConfigContext)
  const { profile, signOut } = useContext(UserContext)
  const [promptTimeout, setPromptTimeout] = useState<number | undefined>()
  const router = useRouter()

  useIdleTimeout(idleTimeout, () => {
    // Only do anything if the user is logged in
    if (profile && signOut) {
      if (promptTimeout) {
        clearTimeout(promptTimeout)
      }
      // Give the user 1 minute to respond to the prompt before they're logged out
      setPromptTimeout(
        (setTimeout(() => {
          setPromptTimeout(undefined)
          signOut()
          router.push(
            `/sign-in?message=${encodeURIComponent(t("authentication.timeout.signOutMessage"))}`
          )
        }, 60000) as unknown) as number
      )
    }
  })

  const modalActions = [
    {
      label: t("authentication.timeout.action"),
      type: "primary" as const,
      onClick: () => {
        clearTimeout(promptTimeout)
        setPromptTimeout(undefined)
      },
    },
  ]

  return (
    <>
      <Modal
        open={Boolean(promptTimeout)}
        title={t("authentication.timeout.title")}
        actions={modalActions}
        fullScreen
      >
        {t("authentication.timeout.text")}
      </Modal>
      {children}
    </>
  )
}
