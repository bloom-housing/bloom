import React, { useEffect, useContext } from "react"
import { PageHeader, t } from "@bloom-housing/ui-components"
import { PageView, pushGtmEvent, AuthContext } from "@bloom-housing/shared-helpers"
import { UserStatus } from "../../lib/constants"
import Layout from "../../layouts/application"
import { MetaTags } from "../../components/shared/MetaTags"
import { professionalsPartnersJurisdictionsCards } from "../../tsx_content/professional-partners-jurisdictions-cards"
import { DoorwayLinkableCardGroup } from "../../components/shared/DoorwayLinkableCardGroup"

const JurisdictionsDeprecated = () => {
  const { profile } = useContext(AuthContext)

  useEffect(() => {
    pushGtmEvent<PageView>({
      event: "pageView",
      pageTitle: "jurisdictions",
      status: profile ? UserStatus.LoggedIn : UserStatus.NotLoggedIn,
    })
  }, [profile])

  const metaDescription = t("pageDescription.jurisdictions")

  return (
    <Layout>
      <PageHeader title={t("pageTitle.jurisdictions")} />
      <MetaTags title={t("pageTitle.jurisdictions")} description={metaDescription} />
      <div className="lg:my-14">
        <DoorwayLinkableCardGroup
          cards={professionalsPartnersJurisdictionsCards()}
          className="m-auto"
        ></DoorwayLinkableCardGroup>
      </div>
    </Layout>
  )
}

export default JurisdictionsDeprecated
