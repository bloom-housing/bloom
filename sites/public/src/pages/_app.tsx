import "@bloom-housing/doorway-ui-components/src/global/css-imports.scss"
import "@bloom-housing/doorway-ui-components/src/global/app-css.scss"
import "@bloom-housing/ui-seeds/src/global/app-css.scss"
import React, { useEffect, useMemo, useState } from "react"
import type { AppProps } from "next/app"
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3"
import { NavigationContext as NavigationContextDoorway } from "@bloom-housing/doorway-ui-components"
import { addTranslation, GenericRouter } from "@bloom-housing/ui-components"
import { NavigationContext } from "@bloom-housing/ui-seeds/src/global/NavigationContext"
import {
  blankApplication,
  LoggedInUserIdleTimeout,
  ConfigProvider,
  AuthProvider,
  MessageProvider,
} from "@bloom-housing/shared-helpers"
import { pageChangeHandler, gaLoadScript, gaCaptureScript } from "../lib/customScripts"
import { AppSubmissionContext } from "../lib/applications/AppSubmissionContext"
import ApplicationConductor, {
  loadApplicationFromAutosave,
  loadSavedListing,
} from "../lib/applications/ApplicationConductor"
import { translations, overrideTranslations } from "../lib/translations"
import LinkComponent from "../components/core/LinkComponent"

import "../../styles/overrides.scss"

const rtlLocales = process.env.rtlLanguages.split(",")

function BloomApp({ Component, router, pageProps }: AppProps) {
  const { locale } = router
  //  const initialized = useState(true)
  const [application, setApplication] = useState(() => {
    return loadApplicationFromAutosave() || JSON.parse(JSON.stringify(blankApplication))
  })
  const [savedListing, setSavedListing] = useState(() => {
    return loadSavedListing()
  })

  const conductor = useMemo(() => {
    return new ApplicationConductor(application, savedListing)
  }, [application, savedListing])

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

  useEffect(() => {
    if (!document.body.dataset.customScriptsLoaded) {
      router.events.on("routeChangeComplete", pageChangeHandler)

      // GA 4 Tracking
      const gaLoadNode = gaLoadScript()
      const gaCaptureNode = gaCaptureScript()
      if (gaLoadNode && gaCaptureNode) {
        document.head.append(gaLoadNode)
        document.head.append(gaCaptureNode)
      }

      document.body.dataset.customScriptsLoaded = "true"
    }

    if (rtlLocales.includes(locale)) {
      if (document.documentElement.getAttribute("dir") !== "rtl") {
        document.documentElement.setAttribute("dir", "rtl")
      }
    } else {
      document.documentElement.setAttribute("dir", "ltr")
    }
  }, [locale, router.events])

  // Investigating performance issues in #3051
  // useEffect(() => {
  //   if (process.env.NODE_ENV !== "production") {
  //     // eslint-disable-next-line @typescript-eslint/no-var-requires
  //     const axe = require("@axe-core/react")
  //     void axe(React, ReactDOM, 5000)
  //   }
  // }, [])

  // HACK ALERT: we need to add the Next link context to both doorway uic and
  // uic in order for routing to work
  // NOTE: Seeds and UI-Components both use a NavigationContext to help internal links use Next's
  // routing system, so we'll include both here until UIC is no longer in use.

  const pageContent = (
    <ConfigProvider apiUrl={process.env.backendApiBase}>
      <AuthProvider>
        <MessageProvider>
          <LoggedInUserIdleTimeout onTimeout={() => conductor.reset()} />
          {hasMounted && <Component {...pageProps} />}
        </MessageProvider>
      </AuthProvider>
    </ConfigProvider>
  )

  return (
    <NavigationContext.Provider
      value={{
        LinkComponent,
      }}
    >
      <NavigationContextDoorway.Provider
        value={{
          LinkComponent,
          router: router as GenericRouter,
        }}
      >
        <AppSubmissionContext.Provider
          value={{
            conductor: conductor,
            application: application,
            listing: savedListing,
            syncApplication: setApplication,
            syncListing: setSavedListing,
          }}
        >
          {process.env.reCaptchaKey ? (
            <GoogleReCaptchaProvider reCaptchaKey={process.env.reCaptchaKey}>
              {pageContent}
            </GoogleReCaptchaProvider>
          ) : (
            pageContent
          )}
        </AppSubmissionContext.Provider>
      </NavigationContextDoorway.Provider>
    </NavigationContext.Provider>
  )
}

export default BloomApp
