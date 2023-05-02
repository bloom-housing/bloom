import { createContext, createElement, FunctionComponent } from "react"

type ConfigContextProps = {
  storageType: "local" | "session"
  apiUrl: string
  idleTimeout: number
}

const timeoutMinutes = parseInt(process.env.idleTimeout || process.env.IDLE_TIMEOUT || "5")
const defaultTimeout = timeoutMinutes * 60 * 1000

export const ConfigContext = createContext<ConfigContextProps>({
  storageType: "session",
  apiUrl: "",
  idleTimeout: defaultTimeout,
})

export const ConfigProvider: FunctionComponent<{
  apiUrl: string
  storageType?: ConfigContextProps["storageType"]
  idleTimeout?: number
  children?: React.ReactNode
}> = ({ apiUrl, storageType = "session", idleTimeout = defaultTimeout, children }) => {
  return createElement(
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
}

export default ConfigContext
