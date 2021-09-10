import * as React from "react"

export default {
  title: "Lists/Numbered List",
}

export const list = () => {
  return (
    <ol className="numbered-list">
      <li>Item One</li>
      <li>Item Two</li>
      <li>Item Three</li>
    </ol>
  )
}
