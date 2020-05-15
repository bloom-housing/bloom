import * as React from "react"

import "./WelcomeHeader.scss"
import { LocalizedLink } from "@bloom-housing/ui-components"

const WelcomeHeader = (props) => (
  <div className="welcome">
    <ul className="welcome__list">
      <li>
        <LocalizedLink href="/welcome">English</LocalizedLink>
      </li>
      <li>
        <LocalizedLink href="/welcome-es">Español</LocalizedLink>
      </li>
      <li>
        <LocalizedLink href="/welcome-vi">Vietnamese</LocalizedLink>
      </li>
    </ul>
  </div>
)

export default WelcomeHeader
