import React, { useMemo } from "react"
import type { AppProps } from "next/app"

import "@bloom-housing/ui-components/src/global/index.scss"
import {
  addTranslation,
  ConfigProvider,
  UserProvider,
  RequireLogin,
  ApiClientProvider,
  NavigationContext,
  GenericRouter,
} from "@bloom-housing/ui-components"

// TODO: Make these not-global
import "ag-grid-community/dist/styles/ag-grid.css"
import "ag-grid-community/dist/styles/ag-theme-alpine.css"

import LinkComponent from "../src/LinkComponent"
import { translations, overrideTranslations } from "../src/translations"

const signInMessage = "Login is required to view this page."

function BloomApp({ Component, router, pageProps }: AppProps) {
  const { locale } = router
  const skipLoginRoutes = ["/forgot-password", "/reset-password"]

  useMemo(() => {
    addTranslation(translations.general, true)
    if (locale && locale !== "en" && translations[locale]) {
      addTranslation(translations[locale])
    }

    if (overrideTranslations[locale]) {
      addTranslation(overrideTranslations[locale])
    }
  }, [locale])

  return (
    <NavigationContext.Provider
      value={{
        LinkComponent: LinkComponent,
        router: router as GenericRouter,
      }}
    >
      <ConfigProvider apiUrl={process.env.backendApiBase}>
        <UserProvider>
          <RequireLogin
            signInPath="/sign-in"
            signInMessage={signInMessage}
            skipForRoutes={skipLoginRoutes}
          >
            <ApiClientProvider>
              <div suppressHydrationWarning>
                {typeof window === "undefined" ? null : <Component {...pageProps} />}
              </div>
            </ApiClientProvider>
          </RequireLogin>
        </UserProvider>
      </ConfigProvider>
    </NavigationContext.Provider>
  )
}

export default BloomApp
