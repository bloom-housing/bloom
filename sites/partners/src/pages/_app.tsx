import React, { useEffect, useMemo, useState } from "react"
import { SWRConfig } from "swr"
import type { AppProps } from "next/app"

import "@bloom-housing/ui-components/src/global/css-imports.scss"
import "@bloom-housing/ui-components/src/global/app-css.scss"
import { addTranslation, NavigationContext, GenericRouter } from "@bloom-housing/ui-components"
import { AuthProvider, ConfigProvider, RequireLogin } from "@bloom-housing/shared-helpers"
import {
  FileProviderConfig,
  FileServiceProvider,
  FileServiceTypeEnum,
} from "@bloom-housing/shared-services"

// TODO: Make these not-global
import "ag-grid-community/dist/styles/ag-grid.css"
import "ag-grid-community/dist/styles/ag-theme-alpine.css"

import LinkComponent from "../components/core/LinkComponent"
import { translations, overrideTranslations } from "../lib/translations"

const signInMessage = "Login is required to view this page."

function BloomApp({ Component, router, pageProps }: AppProps) {
  const { locale } = router
  const skipLoginRoutes = ["/forgot-password", "/reset-password", "/users/confirm", "/users/terms"]

  // fix for rehydration
  const [hasMounted, setHasMounted] = useState(false)
  useEffect(() => {
    setHasMounted(true)
  }, [])

  const fileProviderConfig: FileProviderConfig = {
    publicService: {
      fileServiceType: FileServiceTypeEnum.cloudinary,
      cloudinaryConfig: {
        cloudinaryCloudName: process.env.cloudinaryCloudName || "",
        cloudinaryUploadPreset: process.env.cloudinarySignedPreset || "",
      },
    },
    privateService: {
      fileServiceType: FileServiceTypeEnum.cloudinary,
      cloudinaryConfig: {
        cloudinaryCloudName: process.env.cloudinaryCloudName || "",
        cloudinaryUploadPreset: process.env.cloudinarySignedPreset || "",
      },
    },
  }

  FileServiceProvider.configure(fileProviderConfig)

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
