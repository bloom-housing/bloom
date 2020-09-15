import React from "react"

import "./Flag.scss"

export default {
  title: "Prototypes/Flag",
  decorators: [(storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>],
}

export const Flag = () => (
  <div className="flag">Senior Building</div>
)

export const FlagSmall = () => (
  <div className="flag is-small">Senior Building</div>
)

export const FlagWarn = () => (
  <div className="flag is-warn">Senior Building</div>
)

export const FlagWarnSmall = () => (
  <div className="flag is-small is-warn">Senior Building</div>
)