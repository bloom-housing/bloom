import React, { useEffect, useContext } from "react"
import { t } from "@bloom-housing/ui-components"
import { DoorwayLinkableCardGroup, PageHeader } from "@bloom-housing/doorway-ui-components"
import { PageView, pushGtmEvent, AuthContext } from "@bloom-housing/shared-helpers"
import { UserStatus } from "../../lib/constants"
import Layout from "../../layouts/application"
import { questionsLinkableCards } from "../../tsx_content/questions-cards"

const FrequentlyAskedQuestions = () => {
  const { profile } = useContext(AuthContext)

  useEffect(() => {
    pushGtmEvent<PageView>({
      event: "pageView",
      pageTitle: "FrequentlyAskedQuestions",
      status: profile ? UserStatus.LoggedIn : UserStatus.NotLoggedIn,
    })
  }, [profile])

  const pageTitle = <>{t("pageTitle.questions")}</>

  return (
    <Layout>
      <PageHeader title={pageTitle} />
      <div className="my-14">
        <DoorwayLinkableCardGroup
          cards={questionsLinkableCards()}
          className="m-auto"
        ></DoorwayLinkableCardGroup>
      </div>
    </Layout>
  )
}

export default FrequentlyAskedQuestions
