import React, { createContext, useContext } from "react"
import { JurisdictionContentFields } from "@bloom-housing/shared-helpers/src/types/backend-swagger"

/**
 * The jurisdiction's structured content for the language on screen, or null when it has none.
 *
 * The footer renders from the layout on every page and Resources renders with no props, so the
 * content reaches them here rather than through the component tree. `_app` fills it from the page's
 * props, which means a page with no data function leaves it null and its content falls back to what
 * the repository bundles. #6594 covers giving those pages a data path.
 */
const JurisdictionContentContext = createContext<JurisdictionContentFields | null>(null)

export const JurisdictionContentProvider = ({
  content,
  children,
}: {
  content: JurisdictionContentFields | null
  children: React.ReactNode
}) => (
  <JurisdictionContentContext.Provider value={content}>
    {children}
  </JurisdictionContentContext.Provider>
)

export const useJurisdictionContent = () => useContext(JurisdictionContentContext)
