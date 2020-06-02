import React from "react"
import { withA11y } from "@storybook/addon-a11y"
import "./Modal.scss"
//import Icon from "../atoms/Icon"

export default {
  title: "Prototypes|Modal",
  decorators: [withA11y, (storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>],
}

export const Modal = () => (
  <div role="dialog" className="modal">
    <header className="modal__inner">
      <h1 className="modal__title">Header</h1>
    </header>

    <section className="modal__inner">
      <p className="c-steel">Loreum ipsum</p>
    </section>

    <footer className="modal__footer bg-primary-lighter">
      <div className="modal__button-group">
        <div className="modal__button_item md:order-last">
          <button className="button is-filled">Submit</button>
        </div>
        <div className="modal__button_item">
          <button className="button is-borderless">Cancel</button>
        </div>
      </div>
    </footer>

    <a className="modal__close" aria-label="Close">
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

export const ModalWarning = () => (
  <div role="dialog" className="modal">
    <header className="modal__inner">
      <h1 className="modal__title">Header</h1>
    </header>

    <section className="modal__inner">
      <p className="c-steel">Loreum ipsum</p>
    </section>

    <footer className="modal__footer bg-primary-lighter">
      <div className="modal__button-group">
        <div className="modal__button_item md:order-last">
          <button className="button alert is-filled">Submit</button>
        </div>
        <div className="modal__button_item">
          <button className="button is-borderless">Cancel</button>
        </div>
      </div>
    </footer>

    <a className="modal__close" aria-label="Close">
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
