import React from "react"

const CardSection: React.FunctionComponent = ({ children }) => {
  return <div className="card__section">{children}</div>
}

CardSection.defaultProps = {
  __TYPE: "CardSection",
}

export { CardSection as default, CardSection }
