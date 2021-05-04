import { createContext, createElement, FunctionComponent, useEffect, useState } from "react"
import axios from "axios"

type ConfigContextProps = {
  storageType: "local" | "session"
  apiUrl: string
  idleTimeout: number
  language: string
  setLanguage: (lang: string) => void
}

const timeoutMinutes = parseInt(process.env.idleTimeout || process.env.IDLE_TIMEOUT || "5")
const defaultTimeout = timeoutMinutes * 60 * 1000

export const ConfigContext = createContext<ConfigContextProps>({
  storageType: "session",
  apiUrl: "",
  idleTimeout: defaultTimeout,
  language: "",
  setLanguage: () => undefined,
})

export const ConfigProvider: FunctionComponent<{
  apiUrl: string
  storageType?: ConfigContextProps["storageType"]
  idleTimeout?: number
}> = ({ apiUrl, storageType = "session", idleTimeout = defaultTimeout, children }) => {
  const [language, setLanguage] = useState("")

  useEffect(() => {
    axios.interceptors.request.use((config) => {
      config.headers["county-code"] = process.env.countyCode
      config.headers["lang"] = language
      return config
    }),
      [language]
  })

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
