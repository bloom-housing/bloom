import React, { useEffect, useContext } from "react"
import { t } from "@bloom-housing/ui-components"
import { DoorwayLinkableCardGroup, PageHeader } from "@bloom-housing/doorway-ui-components"
import { PageView, pushGtmEvent, AuthContext } from "@bloom-housing/shared-helpers"
import { UserStatus } from "../../lib/constants"
import Layout from "../../layouts/application"
import {
  housingHelpCardIntro,
  housingHelpLinkableCards,
} from "../../tsx_content/housing-help-cards"

const HousingHelp = () => {
  const { profile } = useContext(AuthContext)

  useEffect(() => {
    pushGtmEvent<PageView>({
      event: "pageView",
      pageTitle: "HousingHelp",
      status: profile ? UserStatus.LoggedIn : UserStatus.NotLoggedIn,
    })
  }, [profile])

  const pageTitle = <>{t("pageTitle.housingHelp")}</>

  return (
    <Layout>
      <PageHeader title={pageTitle} />
      <div className="my-14">
        <DoorwayLinkableCardGroup cards={housingHelpLinkableCards()} className="m-auto">
          {housingHelpCardIntro()}
        </DoorwayLinkableCardGroup>
      </div>
    </Layout>
  )
}

export default HousingHelp
