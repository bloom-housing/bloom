import React from "react"
import App, { Container } from "next/app"
import "@dahlia/styles/src/index.scss"
import { addTranslation } from "@dahlia/ui-components/src/helpers/translator"

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {} // you can add custom props that pass down to all pages here

    if (Component.getInitialProps) {
      let compAsyncProps = await Component.getInitialProps(ctx)
      pageProps = { ...pageProps, ...compAsyncProps }
    }

    const generalTranslations = await import("../static/locales/general.json")
    const sjTranslations = await import("../static/locales/sj.json")
    const smcTranslations = await import("../static/locales/smc.json")
    const translations = {
      general: generalTranslations,
      sj: sjTranslations,
      smc: smcTranslations
    }

    return { pageProps, translations }
  }

  render() {
    const { Component, pageProps, translations } = this.props

    // Setup translations via Polyglot
    addTranslation(translations.general)

    // Extend for different languages or organizations
    // addTranslation(translations.sj)
    //
    return (
      <Container>
        <Component {...pageProps} />
      </Container>
    )
  }
}

export default MyApp
