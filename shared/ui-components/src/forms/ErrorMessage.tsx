import React from "react"

const ErrorMessage = (props) => {
  if (props.error) {
    return (
      <span className="error-message" aria-live="assertive">
        {props.children}
      </span>
    )
  } else {
    return <></>
  }
}

export { ErrorMessage as default, ErrorMessage }
