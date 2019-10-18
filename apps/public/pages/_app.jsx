import React from "react"
import App from "next/app"
import "@bloom/ui-components/styles/index.scss"
import { addTranslation } from "@bloom/ui-components/src/helpers/translator"

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {} // you can add custom props that pass down to all pages here

    if (Component.getInitialProps) {
      const compAsyncProps = await Component.getInitialProps(ctx)
      pageProps = { ...pageProps, ...compAsyncProps }
    }

    const generalTranslations = await import("../static/locales/general.json")
    const spanishTranslations = await import("../static/locales/es.json")
    const translations = {
      general: generalTranslations,
      es: spanishTranslations
    }

    return { pageProps, translations }
  }

  render() {
    const { Component, pageProps, translations } = this.props

    // Setup translations via Polyglot
    addTranslation(translations.general)

    // Extend for different languages
    const language = this.props.router.query.language
    if (language) {
      addTranslation(translations[language])
    }

    return <Component {...pageProps} />
  }
}

export default MyApp
