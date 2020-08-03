import React from "react"
import "./Modal.scss"
import { Button } from "../atoms/Button"

interface ModalProps {
  title: string
  content: string
  alert?: boolean
  submitText: string
  onSubmit: (e: React.MouseEvent) => void
  cancelText: string
  onCancel: (e: React.MouseEvent) => void
}
const Modal = (props: ModalProps) => {
  const { title, content, alert, submitText, onSubmit, cancelText, onCancel } = props
  return (
    <div role="dialog" className="modal">
      <header className="modal__inner">
        <h1 className="modal__title">{title}</h1>
      </header>

      <section className="modal__inner">
        <p className="c-steel">{content}</p>
      </section>

      <footer className="modal__footer bg-primary-lighter">
        <div className="modal__button-group">
          <div className="modal__button_item md:order-last">
            <Button filled={true} className={alert ? "is-alert" : ""} onClick={onSubmit}>
              {submitText}
            </Button>
          </div>
          <div className="modal__button_item">
            <Button filled={true} className="is-borderless" onClick={onCancel}>
              {cancelText}
            </Button>
          </div>
        </div>
      </footer>

      <a className="modal__close" aria-label="Close" onClick={onCancel}>
        <span className="ui-icon">
          <svg id="i-close" viewBox="0 0 32 32">
            <title>close</title>
            <path d="M1.867 0.4c0-0.133 0-0.133 0 0-0.4-0.4-1.2-0.4-1.6 0 0 0 0 0 0 0-0.4 0.4-0.4 1.2 0 1.6l14.133 14 1.6-1.6-14.133-14z"></path>
            <path d="M31.733 1.867c0.4-0.4 0.4-1.2 0-1.6 0 0 0 0 0 0v0c-0.4-0.4-1.2-0.4-1.6 0 0 0 0 0 0 0l-14.133 14.133 1.6 1.6 14.133-14.133z"></path>
            <path d="M31.733 30.133l-15.733-15.733-15.733 15.733c-0.4 0.4-0.4 1.2 0 1.6s1.2 0.4 1.6 0l14.133-14.133 14 14c0.4 0.4 1.2 0.4 1.6 0 0.533-0.4 0.533-1.067 0.133-1.467z"></path>
          </svg>
        </span>
      </a>
    </div>
  )
}

export { Modal as default, Modal }
