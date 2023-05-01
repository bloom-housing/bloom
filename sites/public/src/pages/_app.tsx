import "@bloom-housing/ui-components/src/global/css-imports.scss"
import "@bloom-housing/ui-components/src/global/app-css.scss"
import React, { useEffect, useMemo, useState } from "react"
import type { AppProps } from "next/app"
import { addTranslation, GenericRouter, NavigationContext } from "@bloom-housing/ui-components"
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
import {
  FileProviderConfig,
  FileServiceProvider,
  FileServiceTypeEnum,
} from "@bloom-housing/shared-services"

function BloomApp({ Component, router, pageProps }: AppProps) {
  const { locale } = router
  //  const initialized = useState(true)
  const [application, setApplication] = useState(() => {
    return loadApplicationFromAutosave() || { ...blankApplication }
  })
  const [savedListing, setSavedListing] = useState(() => {
    return loadSavedListing()
  })

  let fileProviderConfig: FileProviderConfig
  if (process.env.fileService === "aws_s3") {
    fileProviderConfig = {
      publicService: {
        fileServiceType: FileServiceTypeEnum.aws_s3,
        awsS3Config: {
          bucketName: process.env.awsS3BucketName || "",
          accessKey: process.env.awsAccessKey || "",
          secretKey: process.env.awsSecretKey || "",
          region: process.env.awsRegion || "",
        },
      },
      privateService: {
        fileServiceType: FileServiceTypeEnum.aws_s3,
        awsS3Config: {
          bucketName: process.env.awsS3BucketName || "",
          accessKey: process.env.awsAccessKey || "",
          secretKey: process.env.awsSecretKey || "",
          region: process.env.awsRegion || "",
        },
      },
    }
  } else if (process.env.fileService === "cloudinary") {
    fileProviderConfig = {
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
  } else {
    throw new Error("Unsupported file service")
  }

  FileServiceProvider.configure(fileProviderConfig)

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
            {hasMounted && <Component {...pageProps} />}
          </AuthProvider>
        </ConfigProvider>
      </AppSubmissionContext.Provider>
    </NavigationContext.Provider>
  )
}

export default BloomApp
