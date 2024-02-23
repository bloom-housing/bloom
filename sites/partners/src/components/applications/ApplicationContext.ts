import React from "react"
import { Application } from "@bloom-housing/shared-helpers/src/types/backend-swagger"

export const ApplicationContext = React.createContext<Application | null>(null)

ApplicationContext.displayName = "ApplicationContext"
