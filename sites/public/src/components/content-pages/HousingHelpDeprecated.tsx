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

const HousingHelpDeprecated = () => {
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
      <PageHeader title={t("pageTitle.housingHelp")} />
      <MetaTags title={t("pageTitle.housingHelp")} description={metaDescription} />
      <div className="lg:my-14">
        <DoorwayLinkableCardGroup cards={housingHelpLinkableCards()} className="m-auto">
          {housingHelpCardIntro()}
        </DoorwayLinkableCardGroup>
      </div>
    </Layout>
  )
}

export default HousingHelpDeprecated
