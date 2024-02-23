import "@bloom-housing/doorway-ui-components/src/global/css-imports.scss"
import "@bloom-housing/doorway-ui-components/src/global/app-css.scss"
import "@bloom-housing/ui-seeds/src/global/app-css.scss"
import React, { useEffect, useMemo, useState } from "react"
import type { AppProps } from "next/app"
import { NavigationContext as NavigationContextDoorway } from "@bloom-housing/doorway-ui-components"
import { addTranslation, GenericRouter } from "@bloom-housing/ui-components"
import { NavigationContext } from "@bloom-housing/ui-seeds/src/global/NavigationContext"
import {
  blankApplication,
  LoggedInUserIdleTimeout,
  ConfigProvider,
  AuthProvider,
} from "@bloom-housing/shared-helpers"
import { headScript, bodyTopTag, pageChangeHandler } from "../lib/customScripts"
import { AppSubmissionContext } from "../lib/applications/AppSubmissionContext"
import ApplicationConductor, {
  loadApplicationFromAutosave,
  loadSavedListing,
} from "../lib/applications/ApplicationConductor"
import { translations, overrideTranslations } from "../lib/translations"
import LinkComponent from "../components/core/LinkComponent"

import "../../styles/overrides.scss"

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
          <ConfigProvider apiUrl={process.env.backendApiBase}>
            <AuthProvider>
              <LoggedInUserIdleTimeout onTimeout={() => conductor.reset()} />
              {hasMounted && <Component {...pageProps} />}
            </AuthProvider>
          </ConfigProvider>
        </AppSubmissionContext.Provider>
      </NavigationContextDoorway.Provider>
    </NavigationContext.Provider>
  )
}

export default BloomApp
