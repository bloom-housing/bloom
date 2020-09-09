import React from "react"
import Icon from "../atoms/Icon"
import SVG from "react-inlinesvg"

import "./Drawer.scss"

export default {
  title: "Prototypes/Drawer",
  decorators: [(storyFn: any) => <div>{storyFn()}<SVG src="/images/icons.svg" /></div>],
}

export const Drawer = () => (
  <div className="drawer__wrapper">
    <div className="drawer is-left" aria-labelledby="Drawer Title" aria-describedby="Drawer description">
      <header className="drawer__header">
        <h1 className="drawer__title">My Drawer</h1>
        <button className="drawer__close" aria-label="Close" tabindex="0">
          <Icon size="medium" symbol="close" />
        </button>
      </header>
      <div className="drawer__body">
        <div className="drawer__content">
          <section className="border p-8 bg-white mb-8">
            <p>Test</p>
          </section>
        </div>
      </div>
    </div>
  </div>
)


export const DrawerBackground = () => (
  <div className="drawer__wrapper drawer__wrappe--backdrop">
    <div className="drawer is-left" aria-labelledby="Drawer Title" aria-describedby="Drawer description">
      <header className="drawer__header">
        <h1 className="drawer__title">My Drawer</h1>
        <button className="drawer__close" aria-label="Close" tabindex="0">
          <Icon size="medium" symbol="close" />
        </button>
      </header>
      <div className="drawer__body">
        <div className="drawer__content">
          <section className="border p-8 bg-white mb-8">
            <p>Test</p>
          </section>
        </div>
      </div>
    </div>
  </div>
)

export const DrawerFieldTest = () => (
  <div className="drawer__wrapper">
    <div className="drawer is-left" aria-labelledby="Drawer Title" aria-describedby="Drawer description">
      <header className="drawer__header">
        <h1 className="drawer__title">My Drawer</h1>
        <button className="drawer__close" aria-label="Close" tabindex="0">
          <Icon size="medium" symbol="close" />
        </button>
      </header>
      <div className="drawer__body">
        <div className="drawer__content">
          <section className="border p-8 bg-white mb-8">
            <div className="field-section">
              <header className="field-section__header">
                <h2 className="field-section__title">My Section</h2>
              </header>  

              <div className="field-grid md:grid md:grid-cols-4 md:gap-8">
                <div className="field">
                  <label className="label" htmlFor="field-1">Label</label>
                  <div className="control">
                    <input className="input" id="field-1" name="field-1" placeholder="Enter text" />
                  </div>
                </div>

                <div className="field">
                  <label className="label" htmlFor="field-2">Label</label>
                  <div className="control">
                    <input className="input" id="field-2" name="field-2" placeholder="Enter text" />
                  </div>
                </div>

                <div className="field">
                  <label className="label" htmlFor="field-3">Label</label>
                  <div className="control">
                    <input className="input" id="field-3" name="field-3" placeholder="Enter text" />
                  </div>
                </div>

                <div className="field">
                  <label className="label" htmlFor="field-4">Label</label>
                  <div className="control">
                    <input className="input" id="field-4" name="field-4" placeholder="Enter text" />
                  </div>
                </div>

                <div className="field">
                  <label className="label" htmlFor="field-5">Label</label>
                  <div className="control">
                    <input className="input" id="field-5" name="field-5" placeholder="Enter text" />
                  </div>
                </div>

                <div className="field">
                  <label className="label" htmlFor="field-6">Label</label>
                  <div className="control">
                    <input className="input" id="field-6" name="field-6" placeholder="Enter text" />
                  </div>
                </div>

                <div className="field">
                  <label className="label" htmlFor="field-7">Label</label>
                  <div className="control">
                    <input className="input" id="field-7" name="field-7" placeholder="Enter text" />
                  </div>
                </div>

                <div className="field">
                  <label className="label" htmlFor="field-8">Label</label>
                  <div className="control">
                    <input className="input" id="field-8" name="field-8" placeholder="Enter text" />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
)

export const DrawerViewTest = () => (
  <div className="drawer__wrapper">
    <div className="drawer is-left" aria-labelledby="Drawer Title" aria-describedby="Drawer description">
      <header className="drawer__header">
        <h1 className="drawer__title">My Drawer</h1>
        <button className="drawer__close" aria-label="Close" tabindex="0">
          <Icon size="medium" symbol="close" />
        </button>
      </header>
      <div className="drawer__body">
        <div className="drawer__content">
          <section className="border p-8 bg-white mb-8">
            <div className="view-section">
              <header className="view-header">
                <h2 className="view-title">My Section</h2>
              </header>

              <div className="view-grid md:grid md:grid-cols-4 md:gap-8 bg-primary-lighter">
                <p className="view-item">
                  <span className="view-item__label">First Name</span>
                  <span className="view-item__value">Lisa</span>
                </p>

                <p className="view-item">
                  <span className="view-item__label">Middle Name</span>
                  <span className="view-item__value">S</span>
                </p>

                <p className="view-item">
                  <span className="view-item__label">Last Name</span>
                  <span className="view-item__value">Jones</span>
                </p>

                <p className="view-item">
                  <span className="view-item__label">Date of Birth</span>
                  <span className="view-item__value">01/01/1985</span>
                </p>

                <p className="view-item">
                  <span className="view-item__label">Email</span>
                  <span className="view-item__value">lisa@gmail.com</span>
                </p>

                <p className="view-item">
                  <span className="view-item__label">Phone</span>
                  <span className="view-item__value">111-222-3333</span>
                  <span className="view-item__helper">Cell</span>
                </p>

                <p className="view-item">
                  <span className="view-item__label">Second Phone</span>
                  <span className="view-item__value">222-333-4444</span>
                  <span className="view-item__helper">Work</span>
                </p>

                <p className="view-item">
                  <span className="view-item__label">Perferred Contact</span>
                  <span className="view-item__value">Phone</span>
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
)