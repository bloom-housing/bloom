import * as React from "react"
import Media from "react-media"
/* eslint-disable @typescript-eslint/ban-ts-ignore */
// @ts-ignore
import * as tailwindConfig from "../../tailwind.config.js"
/* eslint-enable @typescript-eslint/ban-ts-ignore */

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
