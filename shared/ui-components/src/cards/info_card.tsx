import * as React from "react"

interface InfoCardProps {
  title: string
  children: JSX.Element
}

export const InfoCard = (props: InfoCardProps) => (
  <div className="p-3 bg-grey-200">
    <h4>{props.title}</h4>

    {props.children}
  </div>
)
