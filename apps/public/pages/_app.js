import React from "react"
import App, { Container } from "next/app"
import "@dahlia/styles/src/index.scss"
import Polyglot from "node-polyglot"

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {} // you can add custom props that pass down to all pages here

    if (Component.getInitialProps) {
      const compAsyncProps = await Component.getInitialProps(ctx)
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

    const polyglot = new Polyglot({
      phrases: translations.general
    })

    // Using extend will overwrite any duplicate keys, so this can be
    // used by groups to overwrite any standard translation keys, in
    // addition to adding their own group-specific translation keys
    polyglot.extend(translations.sj)
    // Swap above line with below to use SMC translations instead of SJ.
    // polyglot.extend(translations.smc)

    pageProps.polyglot = polyglot

    return (
      <Container>
        <Component {...pageProps} />
      </Container>
    )
  }
}

export default MyApp
