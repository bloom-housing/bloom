import "@bloom-housing/ui-components/src/global/index.scss"
import { useEffect, useMemo, useState } from "react"
import type { AppProps } from "next/app"
import {
  addTranslation,
  GenericRouter,
  NavigationContext,
  UserProvider,
  ConfigProvider,
  ApiClientProvider,
  LoggedInUserIdleTimeout,
  blankApplication,
} from "@bloom-housing/ui-components"
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
    return loadApplicationFromAutosave() || blankApplication()
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
          <UserProvider>
            <ApiClientProvider>
              <LoggedInUserIdleTimeout onTimeout={() => conductor.reset()} />
              <Component {...pageProps} />
            </ApiClientProvider>
          </UserProvider>
        </ConfigProvider>
      </AppSubmissionContext.Provider>
    </NavigationContext.Provider>
  )
}

export default BloomApp
