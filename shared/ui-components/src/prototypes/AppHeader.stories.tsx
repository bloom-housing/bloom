import React from "react"

import "./AppHeader.scss"
import { ProgressNav } from "./ProgressNav"

export default {
  title: "Prototypes/AppHeader",
  decorators: [(storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>],
}

export const AppHeader = () => (
  <div className="app-header">
    <header className="app-header_group">
      <h1 className="app-header_title">Application: 123 Main St.</h1>
    </header>
    <div className="app-header_nav">
      <ProgressNav />
    </div>
  </div>
)

export const AppHeaderProgress = () => (
  <div className="app-header">
    <header className="app-header_group">
      <h1 className="app-header_title">Application: 123 Main St.</h1>
    </header>
    <div className="app-header_nav">
      <div className="progress">
        <ol className="progress-nav">
          <li className="progress-nav__item">
            <a href="#">You</a>
          </li>
          <li className="progress-nav__item is-active">
            <a href="#">Household</a>
          </li>
          <li className="progress-nav__item is-disabled">
            <a href="#">Income</a>
          </li>
          <li className="progress-nav__item is-disabled">
            <a href="#">Preferences</a>
          </li>
          <li className="progress-nav__item is-disabled">
            <a href="#">Review</a>
          </li>
        </ol>
      </div>
    </div>
  </div>
)

export const AppHeaderComplete = () => (
  <div className="app-header">
    <header className="app-header_group">
      <h1 className="app-header_title">Application: 123 Main St.</h1>
    </header>
    <div className="app-header_nav">
      <div className="progress">
        <ol className="progress-nav">
          <li className="progress-nav__item">
            <a href="#">You</a>
          </li>
          <li className="progress-nav__item">
            <a href="#">Household</a>
          </li>
          <li className="progress-nav__item">
            <a href="#">Income</a>
          </li>
          <li className="progress-nav__item">
            <a href="#">Preferences</a>
          </li>
          <li className="progress-nav__item">
            <a href="#">Review</a>
          </li>
        </ol>
      </div>
    </div>
  </div>
)
