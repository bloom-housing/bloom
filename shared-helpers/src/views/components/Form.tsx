import React from "react"

interface FormProps {
  children: React.ReactNode
  id?: string
  className?: string
  disableSubmitOnEnter?: boolean
  onSubmit?: () => unknown
}

export const Form = ({ id, children, className, disableSubmitOnEnter, onSubmit }: FormProps) => {
  function onKeyDown(e: React.KeyboardEvent<HTMLElement>) {
    if (disableSubmitOnEnter && e.key === "Enter" && !(e.target instanceof HTMLButtonElement)) e.preventDefault()
  }

  return (
    <form id={id} className={className} onSubmit={onSubmit} onKeyDown={onKeyDown} noValidate>
      {children}
    </form>
  )
}
