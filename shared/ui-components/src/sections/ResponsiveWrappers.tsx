import * as React from "react"
import Media from "react-media"
import * as tailwindConfig from "../../tailwind.config.js"

export interface ResponsiveWrapperProps {
  children: React.ReactNode
}

const mdBreakpoint = parseInt(tailwindConfig.theme.screens.md.replace("px", ""))

const Desktop = (props: ResponsiveWrapperProps) => (
  <Media render={() => props.children} query={{ minWidth: mdBreakpoint }} defaultMatches={false} />
)

const Mobile = (props: ResponsiveWrapperProps) => (
  <Media
    render={() => props.children}
    query={{ maxWidth: mdBreakpoint - 1 }}
    defaultMatches={true}
  />
)

export { Desktop, Mobile }
