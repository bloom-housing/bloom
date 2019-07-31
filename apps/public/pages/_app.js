import React from 'react'
import App, { Container } from 'next/app'
import "@dahlia/styles/src/index.scss"
import Polyglot from 'node-polyglot'

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {}

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    const sjTranslations = await import('../static/locales/sj.json')
    const smcTranslations = await import('../static/locales/smc.json')
    const translations = {
      sj: sjTranslations,
      smc: smcTranslations
    }

    return { pageProps, translations }
  }

  render() {
    const { Component, pageProps, translations } = this.props

    pageProps.polyglot = new Polyglot({
      phrases: translations.sj
      // phrases: translations.smc
    })

    return (
      <Container>
        <Component {...pageProps} />
      </Container>
    )
  }
}

export default MyApp
