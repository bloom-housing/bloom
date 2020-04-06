import React from "react"
import App from "next/app"
import "@bloom-housing/ui-components/styles/index.scss"
import "../styles/overrides.scss"
import { addTranslation } from "@bloom-housing/ui-components/src/helpers/translator"

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {} // you can add custom props that pass down to all pages here

    if (Component.getInitialProps) {
      const compAsyncProps = await Component.getInitialProps(ctx)
      pageProps = { ...pageProps, ...compAsyncProps }
    }

    const generalTranslations = await import(
      "@bloom-housing/ui-components/src/locales/general.json"
    )
    const spanishTranslations = await import("@bloom-housing/ui-components/src/locales/es.json")
    const translations = {
      general: generalTranslations,
      es: spanishTranslations,
      custom: {
        general: await import("../page_content/locale_overrides/general.json")
        // Uncomment to add additional language overrides
        // es: await import("../page_content/locale_overrides/es.json")
      }
    }
    return { pageProps, translations }
  }

  render() {
    const { Component, pageProps, translations } = this.props

    // Setup translations via Polyglot
    addTranslation(translations.general)
    if (translations.custom) {
      addTranslation(translations.custom.general)
    }

    // Extend for different languages
    const language = this.props.router.query.language
    if (language) {
      addTranslation(translations[language])
      if (translations.custom && translations.custom[language]) {
        addTranslation(translations.custom[language])
      }
    }

    return <Component {...pageProps} />
  }
}

export default MyApp
