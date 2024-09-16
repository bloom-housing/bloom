import React, {
  FunctionComponent,
  createContext,
  createElement,
  useContext,
  useState,
  useRef,
} from "react"
import { CommonMessageProps } from "@bloom-housing/ui-seeds/src/blocks/shared/CommonMessage"

// TODO: this should be exportable from seeds directly
interface ToastProps extends Omit<CommonMessageProps, "role" | "closeable"> {
  hideTimeout?: number
}

const defaultContext = {
  /* eslint-disable @typescript-eslint/no-empty-function */
  /* eslint-disable @typescript-eslint/no-unused-vars */
  addToast: (message: string, props: ToastProps): void => {},
  /* eslint-disable @typescript-eslint/no-explicit-any */
  toastMessagesRef: {} as React.MutableRefObject<Record<string, any>[]>,
}

export const MessageContext = createContext(defaultContext)

export const MessageProvider: FunctionComponent<React.PropsWithChildren> = ({ children }) => {
  const [_, setToastMessages] = useState<Record<string, any>[]>([])
  const toastMessagesRef = useRef<Record<string, any>[]>([])

  // Toast timeouts default to 5 seconds, unless otherwise specified in props
  const addToast = (message: string, props: ToastProps) => {
    const newMsg = { message, props: { hideTimeout: 5000, ...props }, timestamp: Date.now() }
    const msgs = [...toastMessagesRef.current, newMsg]

    // We need a stable ref so live toast messages can be read outside of this function
    toastMessagesRef.current = msgs
    setToastMessages(msgs)

    // Clean up messages after they're expired
    setTimeout(() => {
      toastMessagesRef.current = toastMessagesRef.current.filter(
        (msg) => msg.timestamp !== newMsg.timestamp
      )
    }, newMsg.props.hideTimeout)
  }
  const contextValues = {
    addToast,
    toastMessagesRef,
  }
  return createElement(
    MessageContext.Provider,
    {
      value: contextValues,
    },

    children
  )
}

/**
 * Use the current value of a ref within `useEffect` so you can pass the ref to the dependencies
 * array. Otherwise, the effect will constantly rerun because the context alone isn't a stable ref.
 * File this one in the "Weird React" category!
 */
export const useToastyRef = () => {
  return useRef(useContext(MessageContext))
}
