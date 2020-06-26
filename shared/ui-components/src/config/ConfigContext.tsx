import { createContext, createElement, FunctionComponent } from "react"

type ConfigContextProps = {
  storageType: "local" | "session"
  apiUrl: string
}

export const ConfigContext = createContext<ConfigContextProps>({
  storageType: "session",
  apiUrl: "",
})

export const ConfigProvider: FunctionComponent<{
  apiUrl: string
  storageType?: ConfigContextProps["storageType"]
}> = ({ apiUrl, storageType = "session", children }) =>
  createElement(
    ConfigContext.Provider,
    {
      value: {
        apiUrl,
        storageType,
      },
    },
    children
  )

export default ConfigContext
