import React from "react"
import Icon from "../atoms/Icon"
import SVG from "react-inlinesvg"

import "./Drawer.scss"

export default {
  title: "Prototypes/Drawer",
  decorators: [(storyFn: any) => <div>{storyFn()}<SVG src="/images/icons.svg" /></div>],
}

export const Drawer = () => (
  <div className="drawer is-left">
    <header className="drawer__header">
      <h1 className="drawer__title">My Drawer</h1>
      <button className="drawer__close" aria-label="Close" tabindex="0">
        <Icon size="medium" symbol="close" />
      </button>
    </header>
    <div className="drawer__body">
      <div className="drawer__content">
        <section className="border p-8 bg-white">
          <p>Test</p>
        </section>
      </div>
    </div>
  </div>
)