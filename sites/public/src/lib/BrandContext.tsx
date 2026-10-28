import { createContext, useContext } from "react"
import { BrandDTO } from "@bloom-housing/shared-helpers/src/types/backend-swagger"

// Null when enableDbDrivenBranding is off for the jurisdiction, or on a page with no data
// function.
export const BrandContext = createContext<BrandDTO | null>(null)

export const useBrand = () => useContext(BrandContext)
