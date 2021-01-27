import React from "react"
import { Application } from "@bloom-housing/backend-core/types"

export const ApplicationContext = React.createContext<Application | null>(null)

ApplicationContext.displayName = "ApplicationContext"
