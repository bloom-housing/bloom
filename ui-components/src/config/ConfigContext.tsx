import { createContext, createElement, FunctionComponent, useState } from "react"
import { Language } from "@bloom-housing/backend-core/types"

type ConfigContextProps = {
  storageType: "local" | "session"
  apiUrl: string
  idleTimeout: number
  language: Language
  setLanguage: (language: Language) => void
}

const timeoutMinutes = parseInt(process.env.idleTimeout || process.env.IDLE_TIMEOUT || "5")
const defaultTimeout = timeoutMinutes * 60 * 1000

export const ConfigContext = createContext<ConfigContextProps>({
  storageType: "session",
  apiUrl: "",
  idleTimeout: defaultTimeout,
  language: Language.en,
  setLanguage: () => undefined,
})

export const ConfigProvider: FunctionComponent<{
  apiUrl: string
  storageType?: ConfigContextProps["storageType"]
  idleTimeout?: number
}> = ({ apiUrl, storageType = "session", idleTimeout = defaultTimeout, children }) => {
  const [language, setLanguage] = useState(Language.en)

  // TODO: After adding Next v10 find a way to pass language to headers
  // useEffect(() => {
  //   axios.interceptors.request.use((config) => {
  //     config.headers["county-code"] = process.env.countyCode
  //     config.headers["language"] = language
  //     return config
  //   }),
  //     [language]
  // })

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
