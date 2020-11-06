import React, { useState, useEffect, createRef } from "react"
import "./Overlay.scss"
import useKeyPress from "../helpers/useKeyPress"
import { useOutsideClick } from "../helpers/useOutsideClick"
import { createPortal } from "react-dom"
import FocusLock from "react-focus-lock"
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock"

export type OverlayProps = {
  open: boolean
  ariaLabel: string
  ariaDescription: string
  className?: string
  backdrop?: boolean
  onClose?: () => void
  children: React.ReactNode
}

export const Overlay = (props: OverlayProps) => {
  const documentAvailable = typeof document !== "undefined"
  const overlayRoot = useState<Element | null>(
    documentAvailable ? document.querySelector("#__next") : null
  )[0]
  const elForPortal = useState<Element | null>(
    documentAvailable ? document.createElement("div") : null
  )[0]

  // append overlay to the root of app
  useEffect(() => {
    if (!(open && overlayRoot && elForPortal)) return

    overlayRoot.appendChild(elForPortal)
    disableBodyScroll(elForPortal)

    return () => {
      enableBodyScroll(elForPortal)
      overlayRoot.removeChild(elForPortal)
    }
  }, [elForPortal, overlayRoot, props.open])

  // close overlay on click outside overlay content
  const overlayInnerRef = createRef<HTMLDivElement>()
  useOutsideClick({
    ref: overlayInnerRef,
    callback: () => {
      if (props.onClose) props.onClose()
    },
  })

  useKeyPress("Escape", () => {
    if (props.onClose) props.onClose()
  })

  const classNames = ["fixed-overlay"]
  if (typeof props.backdrop === "undefined" || props.backdrop) classNames.push("is-backdrop")
  if (props.className) classNames.push(props.className)

  return (
    elForPortal &&
    open &&
    createPortal(
      <FocusLock>
        <div
          className={classNames.join(" ")}
          role="dialog"
          aria-labelledby={props.ariaLabel}
          aria-describedby={props.ariaDescription}
        >
          <div className="fixed-overlay__inner" ref={overlayInnerRef}>
            {props.children}
          </div>
        </div>
      </FocusLock>,
      elForPortal
    )
  )
}

export default Overlay
