import React from "react"

const CardHeader: React.FunctionComponent = ({ children }) => {
  return <header className="card__header">{children}</header>
}

CardHeader.defaultProps = {
  __TYPE: "CardHeader",
}

export { CardHeader as default, CardHeader }
