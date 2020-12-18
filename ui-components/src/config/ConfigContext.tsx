import { createContext, createElement, FunctionComponent } from "react"

type ConfigContextProps = {
  storageType: "local" | "session"
  apiUrl: string
  idleTimeout: number
}

const defaultTimeout = 5 * 60 * 1000

export const ConfigContext = createContext<ConfigContextProps>({
  storageType: "session",
  apiUrl: "",
  idleTimeout: defaultTimeout,
})

export const ConfigProvider: FunctionComponent<{
  apiUrl: string
  storageType?: ConfigContextProps["storageType"]
  idleTimeout?: number
}> = ({ apiUrl, storageType = "session", idleTimeout = defaultTimeout, children }) =>
  createElement(
    ConfigContext.Provider,
    {
      value: {
        apiUrl,
        storageType,
        idleTimeout,
      },
    },
    children
  )

export default ConfigContext
