import { createContext, useContext } from "react"
import { JurisdictionContentFields } from "@bloom-housing/shared-helpers/src/types/backend-swagger"

// Null on a page with no data function, where the bundled content stands (#6594).
export const JurisdictionContentContext = createContext<JurisdictionContentFields | null>(null)

export const useJurisdictionContent = () => useContext(JurisdictionContentContext)
