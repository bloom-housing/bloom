import { useContext } from "react"
import UserContext from "./UserContext"
import ConfigContext from "../config/ConfigContext"
import { createAxiosInstance } from "./api_requests"

function useAuthenticatedClient() {
  const { accessToken } = useContext(UserContext)
  const { apiUrl } = useContext(ConfigContext)
  return accessToken ? createAxiosInstance(apiUrl, accessToken) : undefined
}

export { useAuthenticatedClient as default, useAuthenticatedClient }
