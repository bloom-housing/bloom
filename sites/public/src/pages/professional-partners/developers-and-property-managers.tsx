import React, { useEffect, useContext } from "react"
import { t, PageHeader } from "@bloom-housing/ui-components"
import { PageView, pushGtmEvent, AuthContext } from "@bloom-housing/shared-helpers"
import { UserStatus } from "../../lib/constants"
import Layout from "../../layouts/application"
import { MetaTags } from "../../components/shared/MetaTags"
import { professionalsPartnersDevelopersCards } from "../../tsx_content/professional-partners-developers-cards"
import { DoorwayLinkableCardGroup } from "../../components/shared/DoorwayLinkableCardGroup"

const DevelopersAndPropertyManagers = () => {
  const { profile } = useContext(AuthContext)

  useEffect(() => {
    pushGtmEvent<PageView>({
      event: "pageView",
      pageTitle: "developersAndPropertyManagers",
      status: profile ? UserStatus.LoggedIn : UserStatus.NotLoggedIn,
    })
  }, [profile])

  const metaDescription = t("pageDescription.developersAndPropertyManagers")

  return (
    <Layout>
      <PageHeader title={t("pageTitle.developersAndPropertyManagers")} />
      <MetaTags
        title={t("pageTitle.developersAndPropertyManagers")}
        description={metaDescription}
      />
      <div className="lg:my-14">
        <DoorwayLinkableCardGroup
          cards={professionalsPartnersDevelopersCards()}
          className="m-auto"
        ></DoorwayLinkableCardGroup>
      </div>
    </Layout>
  )
}

export default DevelopersAndPropertyManagers
