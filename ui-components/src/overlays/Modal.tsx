import React from "react"
import "./Modal.scss"
import { Icon } from "../icons/Icon"
import { GridCell, GridSection } from "../sections/GridSection"
import { Overlay, OverlayProps } from "./Overlay"

export interface ModalProps extends Omit<OverlayProps, "children"> {
  title: string
  actions?: React.ReactNode[]
  hideCloseIcon?: boolean
  children?: React.ReactNode
}

const ModalHeader = (props: { title: string }) => (
  <header className="modal__inner">
    <h1 className="modal__title">{props.title}</h1>
  </header>
)

const ModalFooter = (props: { actions: React.ReactNode[] }) => (
  <footer className="modal__footer bg-primary-lighter" data-testid="footer">
    <GridSection columns={4} reverse={true} tightSpacing={true}>
      {props.actions &&
        props.actions.map((action: React.ReactNode, index: number) => (
          <GridCell key={index}>{action}</GridCell>
        ))}
    </GridSection>
  </footer>
)

export const Modal = (props: ModalProps) => {
  return (
    <Overlay
      ariaLabel={props.ariaLabel || props.title}
      ariaDescription={props.ariaDescription}
      open={props.open}
      onClose={props.onClose}
      backdrop={props.backdrop}
    >
      <div className="modal">
        <ModalHeader title={props.title} />

        <section className="modal__inner">
          {typeof props.children === "string" ? (
            <p className="c-steel">{props.children}</p>
          ) : (
            props.children
          )}
        </section>

        {props.actions && <ModalFooter actions={props.actions} />}

        {!props.hideCloseIcon && (
          <button className="modal__close" aria-label="Close" onClick={props.onClose} tabIndex={0}>
            <Icon size="medium" symbol="close" />
          </button>
        )}
      </div>
    </Overlay>
  )
}
