import React from "react"
import { Listing } from "@bloom-housing/backend-core/types"

export const ListingContext = React.createContext<Listing | null>(null)

ListingContext.displayName = "ListingContext"
