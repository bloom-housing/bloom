import "@bloom-housing/ui-components/src/global/css-imports.scss"
import "@bloom-housing/ui-components/src/global/app-css.scss"
import React, { useEffect, useMemo, useState } from "react"
import type { AppProps } from "next/app"
import ReactDOM from "react-dom"
import axe from "@axe-core/react"
import { addTranslation, GenericRouter, NavigationContext } from "@bloom-housing/ui-components"
import {
  blankApplication,
  LoggedInUserIdleTimeout,
  ConfigProvider,
  AuthProvider,
} from "@bloom-housing/shared-helpers"
import { headScript, bodyTopTag, pageChangeHandler } from "../src/customScripts"
import { AppSubmissionContext } from "../lib/AppSubmissionContext"
import ApplicationConductor, {
  loadApplicationFromAutosave,
  loadSavedListing,
} from "../lib/ApplicationConductor"
import { translations, overrideTranslations } from "../src/translations"
import LinkComponent from "../src/LinkComponent"

function BloomApp({ Component, router, pageProps }: AppProps) {
  const { locale } = router
  //  const initialized = useState(true)
  const [application, setApplication] = useState(() => {
    return loadApplicationFromAutosave() || { ...blankApplication }
  })
  const [savedListing, setSavedListing] = useState(() => {
    return loadSavedListing()
  })

  const conductor = useMemo(() => {
    return new ApplicationConductor(application, savedListing)
  }, [application, savedListing])

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

      const headScriptTag = document.createElement("script")
      headScriptTag.textContent = headScript()
      if (headScriptTag.textContent !== "") {
        document.head.append(headScriptTag)
      }

      const bodyTopTagTmpl = document.createElement("template")
      bodyTopTagTmpl.innerHTML = bodyTopTag()
      if (bodyTopTagTmpl.innerHTML !== "") {
        document.body.prepend(bodyTopTagTmpl.content.cloneNode(true))
      }

      document.body.dataset.customScriptsLoaded = "true"
    }
  })

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      void axe(React, ReactDOM, 1000)
    }
  }, [])

  return (
    <NavigationContext.Provider
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
        <ConfigProvider apiUrl={process.env.backendApiBase}>
          <AuthProvider>
            <LoggedInUserIdleTimeout onTimeout={() => conductor.reset()} />
            <Component {...pageProps} />
          </AuthProvider>
        </ConfigProvider>
      </AppSubmissionContext.Provider>
    </NavigationContext.Provider>
  )
}

export default BloomApp
