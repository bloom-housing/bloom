import React from "react"
import { Application } from "@bloom-housing/core"

export const DetailsApplicationContext = React.createContext<Application | null>(null)

DetailsApplicationContext.displayName = "DetailsApplicationContext"
