import React from "react"
import { Application } from "@bloom-housing/backend-core/types"

export const DetailsApplicationContext = React.createContext<Application | null>(null)

DetailsApplicationContext.displayName = "DetailsApplicationContext"
