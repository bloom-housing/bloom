import React from "react"
import Head from "next/head"
import Layout from "../../layouts"
import { t } from "@bloom-housing/ui-components"
import { FormUserConfirm } from "../../components/users/FormUserConfirm"

const ConfirmPage = () => {
  return (
    <Layout>
      <Head>
        <title>{`User Confirm - ${t("nav.siteTitlePartners")}`}</title>
      </Head>

      <div className="md:mb-20 md:mt-12 mx-auto max-w-lg print:my-0 print:max-w-full">
        <div className="mt-12">
          <FormUserConfirm />
        </div>
      </div>
    </Layout>
  )
}

export { ConfirmPage as default, ConfirmPage }
