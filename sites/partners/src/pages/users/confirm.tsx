import React from "react"
import Head from "next/head"
import Layout from "../../layouts"
import { t } from "@bloom-housing/ui-components"
import { FormUserConfirm } from "../../components/users/FormUserConfirm"
import { getSiteMessage } from "@bloom-housing/shared-helpers"
import { Toast } from "@bloom-housing/ui-seeds"

const ConfirmPage = () => {
  const successToastMessage = getSiteMessage("success")
  const alertToastMessage = getSiteMessage("alert")
  return (
    <Layout>
      <Head>
        <title>{t("nav.siteTitlePartners")}</title>
      </Head>

      <div className="md:mb-20 md:mt-12 mx-auto max-w-lg print:my-0 print:max-w-full">
        <div className="flex top-21 right-4 absolute z-50 flex-col items-center">
          {successToastMessage && (
            <Toast variant="success" hideTimeout={5000}>
              {successToastMessage}
            </Toast>
          )}
          {alertToastMessage && (
            <Toast variant="alert" hideTimeout={5000}>
              {alertToastMessage}
            </Toast>
          )}
        </div>

        <div className="mt-12">
          <FormUserConfirm />
        </div>
      </div>
    </Layout>
  )
}

export { ConfirmPage as default, ConfirmPage }
