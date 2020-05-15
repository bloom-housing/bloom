import * as React from "react"
import "./ProgressNav.scss"

const ProgressNav = () => (
  <div className="progress">
    <ol className="progress-nav">
      <li className="progress-nav__item is-disabled">
        <a href="#">You</a>
      </li>
      <li className="progress-nav__item is-disabled">
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
)

export { ProgressNav as default, ProgressNav }
