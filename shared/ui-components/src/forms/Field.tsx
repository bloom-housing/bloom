import React from "react"
import ErrorMessage from "./ErrorMessage"

const Field = (props) => {
  const classes = ["field"]
  if (props.error) {
    classes.push("error")
  }
  const controlClasses = ["control"]
  if (props.controlClassName) {
    controlClasses.push(props.controlClassName)
  }

  return (
    <div className={classes.join(" ")}>
      <label htmlFor={props.name}>{props.label}</label>
      <div className={controlClasses.join(" ")}>
        <input
          className="input"
          type={props.type || "text"}
          id={props.id || props.name}
          name={props.name}
          defaultValue={props.defaultValue}
          ref={props.register(props.validation)}
        />
      </div>
      <ErrorMessage error={props.error}>{props.errorMessage}</ErrorMessage>
    </div>
  )
}

export { Field as default, Field }
