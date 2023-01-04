import * as React from "react"

const NumberedHeader = (props: { num: number; text: string }) => (
  <div className="text-serif-xl">
    <span className="text-primary pr-1">{props.num}</span>
    {props.text}
  </div>
)

export { NumberedHeader as default, NumberedHeader }
