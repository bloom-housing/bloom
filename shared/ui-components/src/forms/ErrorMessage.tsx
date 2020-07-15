import React, { ReactNode } from "react"

const ErrorMessage = (props: {
  error?: boolean
  children?: string | JSX.Element | JSX.Element[]
}) => {
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
