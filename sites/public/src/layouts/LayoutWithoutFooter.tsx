import React from "react"
import { useRouter } from "next/router"
import Head from "next/head"
import { t } from "@bloom-housing/ui-components"
import { getSiteHeader } from "../lib/helpers"

const LayoutWithoutFooter = (props) => {
  const router = useRouter()
  return (
    <div className="site-wrapper">
      <div className="site-content">
        <Head>
          <title>{t("nav.siteTitle")}</title>
        </Head>
        {getSiteHeader(router)}
        <main id="main-content" className="md:overflow-x-hidden">
          {props.children}
        </main>
      </div>
    </div>
  )
}

export default LayoutWithoutFooter
