import React from "react"

const ErrorMessage = (props: {
  id?: string
  error?: boolean
  children?: string | JSX.Element | JSX.Element[]
}) => {
  if (props.error) {
    return (
      <span id={props.id} className="error-message" aria-live="assertive">
        {props.children}
      </span>
    )
  } else {
    return <></>
  }
}

export { ErrorMessage as default, ErrorMessage }
