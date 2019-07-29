import React from 'react'
import App, { Container } from 'next/app'
import "@dahlia/styles/src/index.scss"
import Polyglot from 'node-polyglot'

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = { }

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    pageProps.polyglot = new Polyglot({phrases: {'hello': 'This is a translation of "hello"'}});

    return { pageProps }
  }

  render() {
    const { Component, pageProps } = this.props

    return (
      <Container>
        <Component {...pageProps} />
      </Container>
    )
  }
}

export default MyApp
