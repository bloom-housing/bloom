import * as React from "react"

interface InfoCardProps {
  title: string
  children: JSX.Element
}

const InfoCard = (props: InfoCardProps) => (
  <div className="p-3 bg-grey-200">
    <h4>{props.title}</h4>

    {props.children}
  </div>
)

export default InfoCard
