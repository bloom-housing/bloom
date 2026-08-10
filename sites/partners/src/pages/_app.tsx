import React, { FunctionComponent, useEffect, useMemo, useState } from "react"
import Head from "next/head"
import { SWRConfig } from "swr"
import type { AppProps } from "next/app"
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3"

import "@bloom-housing/ui-components/src/global/css-imports.scss"
import "@bloom-housing/ui-components/src/global/app-css.scss"
import "@bloom-housing/ui-seeds/src/global/app-css.scss"
import {
  addTranslation,
  NavigationContext as UICNavigationContext,
  GenericRouter,
} from "@bloom-housing/ui-components"
import { NavigationContext } from "@bloom-housing/ui-seeds/src/global/NavigationContext"
import type { LinkProps as UICLinkProps } from "@bloom-housing/ui-components/src/config/NavigationContext"
import type { LinkProps as SeedsLinkProps } from "@bloom-housing/ui-seeds/src/global/NavigationContext"
import {
  AuthProvider,
  ConfigProvider,
  MessageProvider,
  RequireLogin,
} from "@bloom-housing/shared-helpers"

// TODO: Make these not-global
import "ag-grid-community/dist/styles/ag-grid.css"
import "ag-grid-community/dist/styles/ag-theme-alpine.css"

import LinkComponent from "../components/core/LinkComponent"
import { translations, overrideTranslations } from "../lib/translations"

import "../../styles/overrides.scss"

const signInMessage = "Login is required to view this page."
const skipLoginRoutes = [
  "/forgot-password",
  "/reset-password",
  "/users/confirm",
  "/users/terms",
  "/unauthorized",
]

function BloomApp({ Component, router, pageProps }: AppProps) {
  const { locale } = router

  // fix for rehydration
  const [hasMounted, setHasMounted] = useState(false)
  useEffect(() => {
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

  const pageContent = (
    <ConfigProvider apiUrl={process.env.backendApiBase}>
      <AuthProvider>
        <RequireLogin
          signInPath="/sign-in"
          termsPath="/users/terms"
          signInMessage={signInMessage}
          skipForRoutes={skipLoginRoutes}
        >
          <MessageProvider>{hasMounted && <Component {...pageProps} />}</MessageProvider>
        </RequireLogin>
      </AuthProvider>
    </ConfigProvider>
  )

  return (
    <>
      {process.env.allowSeoIndexing !== "TRUE" && (
        <Head>
          <meta name="robots" content="noindex, nofollow" />
        </Head>
      )}
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
        {/* Seeds and UI-Components each have their own NavigationContext; both are needed so
            internal links use Next's router instead of a full page load. */}
        <NavigationContext.Provider
          value={{ LinkComponent: LinkComponent as FunctionComponent<SeedsLinkProps> }}
        >
          <UICNavigationContext.Provider
            value={{
              LinkComponent: LinkComponent as FunctionComponent<UICLinkProps>,
              router: router as GenericRouter,
            }}
          >
            {process.env.reCaptchaKey ? (
              <GoogleReCaptchaProvider reCaptchaKey={process.env.reCaptchaKey}>
                {pageContent}
              </GoogleReCaptchaProvider>
            ) : (
              pageContent
            )}
          </UICNavigationContext.Provider>
        </NavigationContext.Provider>
      </SWRConfig>
    </>
  )
}

export default BloomApp
