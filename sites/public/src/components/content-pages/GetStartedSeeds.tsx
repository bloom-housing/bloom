import React, { useEffect, useContext } from "react"
import { t } from "@bloom-housing/ui-components"
import { PageView, pushGtmEvent, AuthContext } from "@bloom-housing/shared-helpers"
import { UserStatus } from "../../lib/constants"
import Layout from "../../layouts/application"
import { getStartedLinkableCards } from "../../tsx_content/get-started-cards"
import { MetaTags } from "../../components/shared/MetaTags"
import { DoorwayLinkableCardGroup } from "../../components/shared/DoorwayLinkableCardGroup"
import { PageHeaderLayout } from "../../patterns/PageHeaderLayout"

const GetStartedSeeds = () => {
  const { profile } = useContext(AuthContext)

  useEffect(() => {
    pushGtmEvent<PageView>({
      event: "pageView",
      pageTitle: "GetStarted",
      status: profile ? UserStatus.LoggedIn : UserStatus.NotLoggedIn,
    })
  }, [profile])

  const metaDescription = t("pageDescription.getStarted")

  return (
    <Layout>
      <PageHeaderLayout heading={t("pageTitle.getStarted")}>
        <MetaTags title={t("pageTitle.getStarted")} description={metaDescription} />
        <DoorwayLinkableCardGroup
          cards={getStartedLinkableCards()}
          className="m-auto"
        ></DoorwayLinkableCardGroup>
      </PageHeaderLayout>
    </Layout>
  )
}

export default GetStartedSeeds
