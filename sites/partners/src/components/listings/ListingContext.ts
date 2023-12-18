import React from "react"
import { Listing } from "@bloom-housing/shared-helpers/src/types/backend-swagger"

export const ListingContext = React.createContext<Listing | null>(null)

ListingContext.displayName = "ListingContext"
