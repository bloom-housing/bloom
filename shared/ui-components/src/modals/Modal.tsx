import React, { useState, useEffect, FunctionComponent, createRef } from "react"
import Icon from "../atoms/Icon"
import "./Modal.scss"
import useKeyPress from "../helpers/useKeyPress"
import { useOutsideClick } from "../helpers/useOutsideClick"
import { createPortal } from "react-dom"
import FocusLock from "react-focus-lock"
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock"

type ModalAction = {
  label: string
  onClick: () => void
  type: "primary" | "success" | "failure" | "cancel"
}

export type ModalProps = {
  open: boolean
  title: string
  ariaDescription: string
  actions: ModalAction[]
  className?: string
  fullScreen?: boolean
  // The "x" will only show if onClose is provided
  onClose?: () => void
}

export const Modal: FunctionComponent<ModalProps> = ({
  open,
  title,
  actions,
  className,
  fullScreen = false,
  onClose,
  children,
  ariaDescription,
}) => {
  // append modal to the root of app
  const [modalRoot] = useState<Element | null>(
    typeof document !== "undefined" ? document.querySelector("#__next") : null
  )

  const [el] = useState<Element | null>(
    typeof document !== "undefined" ? document.createElement("div") : null
  )

  const [siteContainer] = useState<Element | null>(
    typeof document !== "undefined" ? document.querySelector(".site-container") : null
  )

  const modalContentRef = createRef<HTMLDivElement>()
  const buttonCloseRef = createRef<HTMLButtonElement>()

  useEffect(() => {
    if (!modalRoot || !el || !siteContainer || !open) return
    modalRoot.appendChild(el)
    siteContainer.setAttribute("aria-hidden", "true")
    disableBodyScroll(el)

    return () => {
      siteContainer.removeAttribute("aria-hidden")
      enableBodyScroll(el)
      modalRoot.removeChild(el)
    }
  }, [el, modalRoot, siteContainer, open])

  useKeyPress("Escape", () => {
    if (onClose) onClose()
  })

  function handleClose() {
    if (onClose) {
      onClose()
    }
  }

  // close modal on click outside modal content
  useOutsideClick({
    ref: modalContentRef,
    callback: handleClose,
  })

  if (!open) {
    return null
  }

  return (
    el &&
    open &&
    createPortal(
      <FocusLock>
        <div
          className={["modal__wrapper", className, fullScreen && "modal__wrapper--backdrop"]
            .filter((name) => Boolean(name))
            .join(" ")}
          role="dialog"
          aria-labelledby={title}
          aria-describedby={ariaDescription}
        >
          <div className="modal" ref={modalContentRef}>
            <header className="modal__inner">
              <h1 className="modal__title">{title}</h1>
            </header>

            <section className="modal__inner">
              {typeof children === "string" ? <p className="c-steel">{children}</p> : children}
            </section>

            <footer className="modal__footer bg-primary-lighter">
              <div className="modal__button-group">
                {actions.map(({ label, onClick, type }) => (
                  <div className="modal__button_item" key={label}>
                    <button className={`button ${type}`} onClick={onClick}>
                      {label}
                    </button>
                  </div>
                ))}
              </div>
            </footer>

            {onClose && (
              <button
                ref={buttonCloseRef}
                className="modal__close"
                aria-label="Close"
                onClick={onClose}
                tabIndex={0}
              >
                <Icon size="medium" symbol="close" />
              </button>
            )}
          </div>
        </div>
      </FocusLock>,
      el
    )
  )
}

export default Modal
