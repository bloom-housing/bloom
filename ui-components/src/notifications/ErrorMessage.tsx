import React from "react"

const ErrorMessage = (props: {
  id?: string
  error?: boolean
  children?: React.ReactNode
  className?: string
}) => {
  if (props.error) {
    const classes = ["error-message"]
    if (props.className) {
      classes.push(props.className)
    }

    return (
      <span
        id={props.id}
        className={classes.join(" ")}
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
