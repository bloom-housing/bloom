import * as React from "react"
import "./HeaderBadge.scss"

const HeaderBadge = () => (
  <span class="header-badge">
    <svg id="i-favorite" viewBox="0 0 35 32">
      <title>favorite</title>
      <path fill="#d75a4a" d="M17.229 5.883c1.4-3.291 4.595-5.592 8.314-5.592 5.008 0 8.614 4.253 9.069 9.32 0 0 0.245 1.259-0.294 3.523-0.733 3.085-2.458 5.824-4.782 7.915l-12.306 10.896-12.098-10.898c-2.325-2.091-4.050-4.83-4.782-7.915-0.539-2.264-0.294-3.523-0.294-3.523 0.453-5.067 4.061-9.32 9.069-9.32 3.718 0 6.707 2.301 8.106 5.592z"></path>
    </svg>
  </span>
)

export { HeaderBadge as default, HeaderBadge }