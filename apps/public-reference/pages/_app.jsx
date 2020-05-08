import React from "react"
import App from "next/app"
import Router from "next/router"
import "@bloom-housing/ui-components/styles/index.scss"
import { addTranslation } from "@bloom-housing/ui-components"
import { headScript, bodyTopTag, pageChangeHandler } from "../src/customScripts"

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

  /* eslint-disable no-undef */
  componentDidMount() {
    // NOTE: this may get called without a full page reload,
    // so we need to enforce idempotency
    if (!document.body.customScriptsLoaded) {
      Router.events.on("routeChangeComplete", pageChangeHandler)

      const headScriptTag = document.createElement("script")
      headScriptTag.textContent = headScript()
      if (headScriptTag.textContent != "") {
        document.head.append(headScriptTag)
      }

      const bodyTopTagTmpl = document.createElement("template")
      bodyTopTagTmpl.innerHTML = bodyTopTag()
      if (bodyTopTagTmpl.innerHTML != "") {
        document.body.prepend(bodyTopTagTmpl.content.cloneNode(true))
      }

      document.body.customScriptsLoaded = true
    }
  }
  /* eslint-enable no-undef */

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
