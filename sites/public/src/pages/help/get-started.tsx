import React, { useEffect, useContext } from "react"
import { t } from "@bloom-housing/ui-components"
import { DoorwayLinkableCardGroup, PageHeader } from "@bloom-housing/doorway-ui-components"
import { PageView, pushGtmEvent, AuthContext } from "@bloom-housing/shared-helpers"
import { UserStatus } from "../../lib/constants"
import Layout from "../../layouts/application"
import { getStartedLinkableCards } from "../../tsx_content/get-started-cards"

const GetStarted = () => {
  const { profile } = useContext(AuthContext)

  useEffect(() => {
    pushGtmEvent<PageView>({
      event: "pageView",
      pageTitle: "GetStarted",
      status: profile ? UserStatus.LoggedIn : UserStatus.NotLoggedIn,
    })
  }, [profile])

  const pageTitle = <>{t("pageTitle.getStarted")}</>

  return (
    <Layout>
      <PageHeader title={pageTitle} />
      <div className="my-14">
        <DoorwayLinkableCardGroup
          cards={getStartedLinkableCards()}
          className="m-auto"
        ></DoorwayLinkableCardGroup>
      </div>
    </Layout>
  )
}

export default GetStarted
