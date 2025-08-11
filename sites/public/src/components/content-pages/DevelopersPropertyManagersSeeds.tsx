import React, { useEffect, useContext } from "react"
import { t } from "@bloom-housing/ui-components"
import { PageView, pushGtmEvent, AuthContext } from "@bloom-housing/shared-helpers"
import { UserStatus } from "../../lib/constants"
import Layout from "../../layouts/application"
import { MetaTags } from "../../components/shared/MetaTags"
import { professionalsPartnersDevelopersCards } from "../../tsx_content/professional-partners-developers-cards"
import { DoorwayLinkableCardGroup } from "../../components/shared/DoorwayLinkableCardGroup"
import { PageHeaderLayout } from "../../patterns/PageHeaderLayout"

const DevelopersAndPropertyManagersSeeds = () => {
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
      <PageHeaderLayout heading={t("pageTitle.developersAndPropertyManagers")}>
        <MetaTags
          title={t("pageTitle.developersAndPropertyManagers")}
          description={metaDescription}
        />
        <DoorwayLinkableCardGroup
          cards={professionalsPartnersDevelopersCards()}
          className="m-auto"
        ></DoorwayLinkableCardGroup>
      </PageHeaderLayout>
    </Layout>
  )
}

export default DevelopersAndPropertyManagersSeeds
