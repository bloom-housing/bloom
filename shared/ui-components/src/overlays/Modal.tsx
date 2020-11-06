import React from "react"
import "./Modal.scss"
import { Icon } from "../icons/Icon"
import { GridCell, GridSection } from "../sections/GridSection"

export interface ModalProps {
  title: string
  actions: React.ReactNode[]
  hideCloseIcon?: boolean
  onClose?: () => void
  children?: React.ReactNode
}

const ModalHeader = (props) => (
  <header className="modal__inner">
    <h1 className="modal__title">{props.title}</h1>
  </header>
)

const ModalFooter = (props) => (
  <footer className="modal__footer bg-primary-lighter">
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
    <div className="modal">
      <ModalHeader title={props.title} />

      <section className="modal__inner">
        {typeof props.children === "string" ? (
          <p className="c-steel">{props.children}</p>
        ) : (
          props.children
        )}
      </section>

      <ModalFooter actions={props.actions} />

      {props.hideCloseIcon && (
        <button className="modal__close" aria-label="Close" onClick={props.onClose} tabIndex={0}>
          <Icon size="medium" symbol="close" />
        </button>
      )}
    </div>
  )
}
