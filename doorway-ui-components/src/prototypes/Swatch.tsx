import * as React from "react"

export const Swatch = (props: { colorVar: string }) => (
  <span
    style={{ backgroundColor: `var(${props.colorVar})` }}
    title={props.colorVar}
    className="w-6 border border-gray-500 inline-block"
  >
    &nbsp;
  </span>
)
