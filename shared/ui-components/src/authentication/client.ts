import { ApplicationsService, serviceOptions } from "@bloom-housing/backend-core/client"
import { useAuthenticatedClient } from "./useAuthenticatedClient"
import { createContext, createElement, FunctionComponent, useContext } from "react"
import axiosStatic from "axios"
import { ConfigContext } from "../config/ConfigContext"

type ContextProps = {
  applicationsService: ApplicationsService
}

export const ApiClientContext = createContext<Partial<ContextProps>>({})
export const ApiClientProvider: FunctionComponent = ({ children }) => {
  const { apiUrl } = useContext(ConfigContext)
  const authClient = useAuthenticatedClient()
  if (authClient) {
    serviceOptions.axios = useAuthenticatedClient()
  } else {
    serviceOptions.axios = axiosStatic.create({
      baseURL: apiUrl,
    })
  }
  return createElement(
    ApiClientContext.Provider,
    {
      value: {
        applicationsService: ApplicationsService,
      },
    },
    children
  )
}
