import React from "react"
import App from "next/app"
import "@bloom-housing/ui-components/src/global/index.scss"
import {
  addTranslation,
  ConfigProvider,
  UserProvider,
  RequireLogin,
  ApiClientProvider,
} from "@bloom-housing/ui-components"

// TODO: Make these not-global
import "ag-grid-community/dist/styles/ag-grid.css"
import "ag-grid-community/dist/styles/ag-theme-alpine.css"

class MyApp extends App {
  constructor(props) {
    super(props)
  }

  // This gets passed along through the context
  syncApplication = (data) => {
    this.setState({ application: data })
  }

  static async getInitialProps({ Component, ctx }) {
    let pageProps = {} // you can add custom props that pass down to all pages here

    if (Component.getInitialProps) {
      const compAsyncProps = await Component.getInitialProps(ctx)
      pageProps = { ...pageProps, ...compAsyncProps }
    }

    const generalTranslations = await import(
      "@bloom-housing/ui-components/src/locales/general.json"
    )
    const translations = {
      general: generalTranslations,
      custom: {
        general: await import("../page_content/locale_overrides/general.json"),
        // Uncomment to add additional language overrides
        // es: await import("../page_content/locale_overrides/es.json")
      },
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

    const signInMessage = "Login is required to view this page."

    return (
      <ConfigProvider apiUrl={process.env.backendApiBase}>
        <UserProvider>
          <RequireLogin signInPath="/sign-in" signInMessage={signInMessage}>
            <ApiClientProvider>
              <Component {...pageProps} />
            </ApiClientProvider>
          </RequireLogin>
        </UserProvider>
      </ConfigProvider>
    )
  }
}

export default MyApp
