import React, { useRef } from "react"
import "./Modal.scss"
import { Icon, IconFillColors } from "../icons/Icon"
import { Overlay, OverlayProps } from "./Overlay"
import { nanoid } from "nanoid"

export interface ModalProps extends Omit<OverlayProps, "children"> {
  actions?: React.ReactNode[]
  children?: React.ReactNode
  closeClassNames?: string
  closeIconColor?: string
  hideCloseIcon?: boolean
  innerClassNames?: string
  modalClassNames?: string
  headerClassNames?: string
  role?: string
  scrollableModal?: boolean
  scrollableOverlay?: boolean
  slim?: boolean
  title: string
}

const ModalHeader = (props: { title: string; uniqueId?: string; className?: string }) => {
  const classNames = ["modal__title"]
  if (props.className) classNames.push(props.className)
  return (
    <>
      <header className="modal__header">
        <h1 className={classNames.join(" ")} id={props.uniqueId}>
          {props.title}
        </h1>
      </header>
    </>
  )
}

const ModalFooter = (props: { actions: React.ReactNode[] }) => (
  <footer className="modal__footer" data-testid="footer">
    {props.actions.map((action: React.ReactNode, index: number) => (
      <React.Fragment key={index}>{action}</React.Fragment>
    ))}
  </footer>
)

export const Modal = (props: ModalProps) => {
  const uniqueIdRef = useRef(nanoid())
  const modalClassNames = ["modal"]
  const innerClassNames = ["modal__inner"]
  const closeClassNames = ["modal__close"]
  if (props.scrollableModal) innerClassNames.push("is-scrollable")
  if (props.modalClassNames) modalClassNames.push(...props.modalClassNames.split(" "))
  if (props.innerClassNames) innerClassNames.push(...props.innerClassNames.split(" "))
  if (props.closeClassNames) closeClassNames.push(...props.closeClassNames.split(" "))

  return (
    <Overlay
      ariaLabelledBy={uniqueIdRef.current}
      ariaDescription={props.ariaDescription}
      open={props.open}
      onClose={props.onClose}
      className={props.className}
      backdrop={props.backdrop}
      slim={props.slim}
      role={props.role ? props.role : "dialog"}
      scrollable={props.scrollableOverlay}
    >
      <div className={modalClassNames.join(" ")}>
        {!props.hideCloseIcon && (
          <button
            className={closeClassNames.join(" ")}
            aria-label="Close"
            onClick={props.onClose}
            tabIndex={0}
          >
            <Icon
              size="medium"
              symbol="close"
              fill={props.closeIconColor ?? IconFillColors.primary}
            />
          </button>
        )}
        <ModalHeader
          title={props.title}
          uniqueId={uniqueIdRef.current}
          className={props.headerClassNames}
        />

        <section className={innerClassNames.join(" ")}>
          {typeof props.children === "string" ? <p>{props.children}</p> : props.children}
        </section>

        {props.actions && <ModalFooter actions={props.actions} />}
      </div>
    </Overlay>
  )
}
