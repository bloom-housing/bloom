import React, { useEffect, useMemo, useState } from "react"
import { SWRConfig } from "swr"
import type { AppProps } from "next/app"

import "@bloom-housing/ui-components/src/global/css-imports.scss"
import "@bloom-housing/ui-components/src/global/app-css.scss"
import "@bloom-housing/ui-seeds/src/global/app-css.scss"
import { addTranslation, NavigationContext, GenericRouter } from "@bloom-housing/ui-components"
import { AuthProvider, ConfigProvider, RequireLogin } from "@bloom-housing/shared-helpers"

// TODO: Make these not-global
import "ag-grid-community/dist/styles/ag-grid.css"
import "ag-grid-community/dist/styles/ag-theme-alpine.css"

import LinkComponent from "../components/core/LinkComponent"
import { translations, overrideTranslations } from "../lib/translations"

import "../../styles/overrides.scss"

const signInMessage = "Login is required to view this page."

export const heapScript = () => {
  const heapKey = process.env.heapKey
  if (heapKey) {
    const script = document.createElement("script")
    script.innerHTML = `
    window.heap=window.heap||[],heap.load=function(e,t){window.heap.appid=e,window.heap.config=t=t||{};var r=document.createElement("script");r.type="text/javascript",r.async=!0,r.src="https://cdn.heapanalytics.com/js/heap-"+e+".js";var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(r,a);for(var n=function(e){return function(){heap.push([e].concat(Array.prototype.slice.call(arguments,0)))}},p=["addEventProperties","addUserProperties","clearEventProperties","identify","resetIdentity","removeEventProperty","setEventProperties","track","unsetEventProperty"],o=0;o<p.length;o++)heap[p[o]]=n(p[o])};
    heap.load("${heapKey}");`
    return script
  } else return null
}

function BloomApp({ Component, router, pageProps }: AppProps) {
  const { locale } = router
  const skipLoginRoutes = ["/forgot-password", "/reset-password", "/users/confirm", "/users/terms"]

  // fix for rehydration
  const [hasMounted, setHasMounted] = useState(false)
  useEffect(() => {
    const heapNode = heapScript()
    if (heapNode) {
      document.head.append(heapNode)
    }
    setHasMounted(true)
  }, [])

  useMemo(() => {
    addTranslation(translations.general, true)
    if (locale && locale !== "en" && translations[locale]) {
      addTranslation(translations[locale])
    }
    addTranslation(overrideTranslations.en)
    if (overrideTranslations[locale]) {
      addTranslation(overrideTranslations[locale])
    }
  }, [locale])

  // Investigating performance issues in #3051
  // useEffect(() => {
  //   if (process.env.NODE_ENV !== "production") {
  //     // eslint-disable-next-line @typescript-eslint/no-var-requires
  //     const axe = require("@axe-core/react")
  //     void axe(React, ReactDOM, 1000)
  //   }
  // }, [])

  return (
    <SWRConfig
      value={{
        onError: (error) => {
          const { status } = error.response || {}
          if (status === 403) {
            window.location.href = "/unauthorized"
          }
        },
      }}
    >
      <NavigationContext.Provider
        value={{
          LinkComponent: LinkComponent,
          router: router as GenericRouter,
        }}
      >
        <ConfigProvider apiUrl={process.env.backendApiBase}>
          <AuthProvider>
            <RequireLogin
              signInPath="/sign-in"
              termsPath="/users/terms"
              signInMessage={signInMessage}
              skipForRoutes={skipLoginRoutes}
            >
              {hasMounted && <Component {...pageProps} />}
            </RequireLogin>
          </AuthProvider>
        </ConfigProvider>
      </NavigationContext.Provider>
    </SWRConfig>
  )
}

export default BloomApp
