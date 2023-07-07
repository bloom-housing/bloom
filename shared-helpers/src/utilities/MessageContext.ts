import React, { FunctionComponent, createElement, useRef, useState } from "react"

export enum alertTypes {
  success = "success",
  alert = "alert",
  notice = "notice",
  primary = "primary",
}

const defaultContext = {
  getToastMessage: (): string | null => "",
  getToastProps: (): object => {
    return {}
  },
  /* eslint-disable @typescript-eslint/no-empty-function */
  /* eslint-disable @typescript-eslint/no-explicit-any */
  setToast: (_message: string, _toastProps: any): void => {},
  toastMessage: "" as string,
}

export const MessageContext = React.createContext(defaultContext)

export const MessageProvider: FunctionComponent<React.PropsWithChildren> = ({ children }) => {
  const [toastMessage, setToastMessage] = useState<string>("")
  const [toastProps, setToastProps] = useState<object>({})
  const pendingToast = useRef<boolean>(false)

  const getToastProps = () => {
    if (!pendingToast) return {}
    return toastProps
  }

  const getToastMessage = () => {
    if (pendingToast.current === false) return null
    pendingToast.current = false
    return toastMessage
  }

  const setToast = (message: string, toastProps: object) => {
    setToastMessage(message)
    setToastProps(toastProps)
    pendingToast.current = true
  }

  const contextValues = {
    getToastProps,
    getToastMessage,
    setToast,
    toastMessage,
  }
  return createElement(
    MessageContext.Provider,
    {
      value: contextValues,
    },

    children
  )
}
