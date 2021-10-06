import React from "react"
import Head from "next/head"
import Layout from "../../layouts"
import { t, SiteAlert } from "@bloom-housing/ui-components"
import { FormUserConfirm } from "../../src/users/FormUserConfirm"

const ConfirmPage = () => {
  return (
    <Layout>
      <Head>
        <title>{t("nav.siteTitlePartners")}</title>
      </Head>

      <div className="md:mb-20 md:mt-12 mx-auto max-w-lg print:my-0 print:max-w-full">
        <div className="flex top-21 right-4 absolute z-50 flex-col items-center">
          <SiteAlert type="success" timeout={5000} dismissable />
          <SiteAlert type="alert" timeout={5000} dismissable />
        </div>

        <div className="mt-12">
          <FormUserConfirm />
        </div>
      </div>
    </Layout>
  )
}

export { ConfirmPage as default, ConfirmPage }
