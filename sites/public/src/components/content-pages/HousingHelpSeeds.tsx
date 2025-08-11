import React, { useEffect, useContext } from "react"
import { t, PageHeader } from "@bloom-housing/ui-components"
import { PageView, pushGtmEvent, AuthContext } from "@bloom-housing/shared-helpers"
import { UserStatus } from "../../lib/constants"
import Layout from "../../layouts/application"
import { MetaTags } from "../../components/shared/MetaTags"
import {
  housingHelpCardIntro,
  housingHelpLinkableCards,
} from "../../tsx_content/housing-help-cards"
import { DoorwayLinkableCardGroup } from "../../components/shared/DoorwayLinkableCardGroup"
import { PageHeaderLayout } from "../../patterns/PageHeaderLayout"

const HousingHelpSeeds = () => {
  const { profile } = useContext(AuthContext)

  useEffect(() => {
    pushGtmEvent<PageView>({
      event: "pageView",
      pageTitle: "HousingHelp",
      status: profile ? UserStatus.LoggedIn : UserStatus.NotLoggedIn,
    })
  }, [profile])

  const metaDescription = t("pageDescription.housingHelp")

  return (
    <Layout>
      <PageHeaderLayout heading={t("pageTitle.housingHelp")}>
        <MetaTags title={t("pageTitle.housingHelp")} description={metaDescription} />
        <DoorwayLinkableCardGroup cards={housingHelpLinkableCards()} className="m-auto">
          {housingHelpCardIntro()}
        </DoorwayLinkableCardGroup>
      </PageHeaderLayout>
    </Layout>
  )
}

export default HousingHelpSeeds
