import React from "react"

const ErrorMessage = (props: { id?: string; error?: boolean; children?: React.ReactNode }) => {
  if (props.error) {
    return (
      <span
        id={props.id}
        className="error-message"
        aria-live="assertive"
        data-test-id={"error-message"}
      >
        {props.children}
      </span>
    )
  } else {
    return <></>
  }
}

export { ErrorMessage as default, ErrorMessage }
