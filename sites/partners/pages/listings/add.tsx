import React, { useContext } from "react"
import Head from "next/head"
import { PageHeader, SiteAlert, t, AuthContext } from "@bloom-housing/ui-components"
import { UserRole } from "@bloom-housing/backend-core/types"
import Layout from "../../layouts"
import PaperListingForm from "../../src/listings/PaperListingForm"
import { MetaTags } from "../../src/MetaTags"

const NewListing = () => {
  const metaDescription = ""
  const metaImage = "" // TODO: replace with hero image
  const { profile } = useContext(AuthContext)

  if (!profile.roles.includes(UserRole.admin)) return "An error has occurred."

  return (
    <Layout>
      <Head>
        <title>{t("nav.siteTitlePartners")}</title>
      </Head>
      <MetaTags
        title={t("nav.siteTitlePartners")}
        image={metaImage}
        description={metaDescription}
      />

      <PageHeader className="relative" title={t("listings.newListing")}>
        <div className="flex top-4 right-4 absolute z-50 flex-col items-center">
          <SiteAlert type="success" timeout={5000} dismissable />
        </div>
      </PageHeader>

      <PaperListingForm />
    </Layout>
  )
}

export default NewListing
