import * as React from "react"
import LocalizedLink from "@bloom-housing/ui-components/src/atoms/LocalizedLink"

import "./WelcomeHeader.scss"

const WelcomeHeader = props => (
  <div className="welcome">
    <ul className="welcome__list">
      <li>
        <LocalizedLink href="/welcome">English</LocalizedLink>
      </li>
      <li>
        <LocalizedLink href="/welcome-es">Espanol</LocalizedLink>
      </li>
      <li>
        <LocalizedLink href="/welcome-vi">Vietnamese</LocalizedLink>
      </li>
    </ul>
  </div>
)

export default WelcomeHeader
