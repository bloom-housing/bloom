import React, { FunctionComponent } from "react"
import Icon from "../atoms/Icon"
import "./Modal.scss"

type ModalAction = {
  label: string
  onClick: () => void
  type: "primary" | "success" | "failure" | "cancel"
}

export type ModalProps = {
  open: boolean
  title: string
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
}) => {
  if (!open) {
    return null
  }

  return (
    <div
      className={["modal__wrapper", className, fullScreen && "full-screen"]
        .filter((name) => Boolean(name))
        .join(" ")}
    >
      {fullScreen && <div className="modal__backdrop" />}
      <div className="modal" role="dialog">
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
          <a className="modal__close" aria-label="Close" onClick={onClose}>
            <Icon size="medium" symbol="close" />
          </a>
        )}
      </div>
    </div>
  )
}

export default Modal
