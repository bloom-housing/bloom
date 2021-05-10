import { createContext, createElement, FunctionComponent, useState } from "react"

type ConfigContextProps = {
  storageType: "local" | "session"
  apiUrl: string
  idleTimeout: number
  language: string
  setLanguage: (language: string) => void
}

const timeoutMinutes = parseInt(process.env.idleTimeout || process.env.IDLE_TIMEOUT || "5")
const defaultTimeout = timeoutMinutes * 60 * 1000
const defaultLanguage = "en"

export const ConfigContext = createContext<ConfigContextProps>({
  storageType: "session",
  apiUrl: "",
  idleTimeout: defaultTimeout,
  language: defaultLanguage,
  setLanguage: () => undefined,
})

export const ConfigProvider: FunctionComponent<{
  apiUrl: string
  storageType?: ConfigContextProps["storageType"]
  idleTimeout?: number
}> = ({ apiUrl, storageType = "session", idleTimeout = defaultTimeout, children }) => {
  const [language, setLanguage] = useState(defaultLanguage)

  return createElement(
    ConfigContext.Provider,
    {
      value: {
        apiUrl,
        storageType,
        idleTimeout,
        language,
        setLanguage,
      },
    },
    children
  )
}

export default ConfigContext
