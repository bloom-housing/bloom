import React from "react"

const CardFooter: React.FunctionComponent = ({ children }) => {
  return <footer className="card__footer">{children}</footer>
}

CardFooter.defaultProps = {
  __TYPE: "CardFooter",
}

export { CardFooter as default, CardFooter }
