import React from "react"

const CardImage: React.FunctionComponent = ({ children }) => {
  return <figure className="card__image">{children}</figure>
}

CardImage.defaultProps = {
  __TYPE: "CardImage",
}

export { CardImage as default, CardImage }
