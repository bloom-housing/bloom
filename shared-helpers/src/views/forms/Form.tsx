import React, { useCallback } from "react"

export interface FormProps {
  children: React.ReactNode
  className?: string
  id?: string
  method?: "get" | "post"
  onBlur?: (event: React.FocusEvent<HTMLFormElement>) => void
  onSubmit?: () => unknown
  suppressSubmitOnEnter?: boolean
}

export const Form = ({
  children,
  id,
  className,
  method = "post",
  suppressSubmitOnEnter = true,
  onBlur,
  onSubmit,
}: FormProps) => {
  const onKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLElement>) => {
      if (
        suppressSubmitOnEnter &&
        event.key === "Enter" &&
        !(event.target instanceof HTMLButtonElement)
      )
        event.preventDefault()
    },
    [suppressSubmitOnEnter]
  )

  return (
    // eslint-disable-next-line  jsx-a11y/no-noninteractive-element-interactions
    <form
      id={id}
      className={className}
      onBlur={onBlur}
      onSubmit={onSubmit}
      onKeyDown={onKeyDown}
      noValidate
      method={method}
    >
      {children}
    </form>
  )
}
