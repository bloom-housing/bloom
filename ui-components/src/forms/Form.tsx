import React from "react"

interface FormProps {
  children: React.ReactNode
  id?: string
  className?: string
  onSubmit?: () => unknown
}

const Form = ({ id, children, className, onSubmit }: FormProps) => {
  function onKeyPress(e: React.KeyboardEvent<HTMLElement>) {
    return e.key === "Enter" && !(e.target instanceof HTMLButtonElement) && e.preventDefault()
  }

  return (
    <form id={id} className={className} onSubmit={onSubmit} onKeyPress={onKeyPress} noValidate>
      {children}
    </form>
  )
}

export { Form as default, Form }
