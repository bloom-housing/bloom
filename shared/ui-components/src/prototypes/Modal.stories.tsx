import React from "react"
import { withA11y } from "@storybook/addon-a11y"
import "./Modal.scss"
import Icon from "../atoms/Icon"

export default {
  title: "Prototypes|Modal",
  decorators: [withA11y, (storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>]
}

export const Modal = () => (
  <div aria-labelledby="modalTitle" aria-hidden="true" role="dialog">
    <header className="modal__inner">
      <h1 className="modal__title">Header</h1>
    </header>

    <section className="modal__inner">
      <p className="c-steel">Loreum ipsum</p>
    </section>

    <footer className="modal__footer bg-primary-lighter">
      <div className="modal__button-group">
        <div className="modal__button_item md:order-last">
          <button className="button">Submit</button>
         </div>
         <div className="modal__button_item">
           <button className="button no-border">Cancel</button>
         </div>
      </div>
    </footer>

    <a className="modal__close" aria-label="Close">
    <span className="ui-icon">
      
    </span>
  </a>
</div>
)