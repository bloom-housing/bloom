import React from "react"
import { t, PageHeader } from "@bloom-housing/ui-components"
import Layout from "../layouts/application"

export default function About() {
  return (
    <Layout>
      <PageHeader title={t("pageTitle.about")} inverse />
      <div className="max-w-5xl m-auto px-5">
        <p className="my-8">{t("about.body1")}</p>
        <p className="my-8">{t("about.body2")}</p>
        <p>{t("about.moreInfoContact")}</p>
        <p className="my-8">{t("about.thankYouPartners")}</p>
        <p className="my-8">{t("about.partnersList")}</p>
      </div>
    </Layout>
  )
}
