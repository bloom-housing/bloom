import React, { useEffect, useContext } from "react"
import { PageHeader, t } from "@bloom-housing/ui-components"
import { PageView, pushGtmEvent, AuthContext } from "@bloom-housing/shared-helpers"
import { UserStatus } from "../../lib/constants"
import Layout from "../../layouts/application"
import { questionsLinkableCards } from "../../tsx_content/questions-cards"
import { MetaTags } from "../../components/shared/MetaTags"
import { DoorwayLinkableCardGroup } from "../../components/shared/DoorwayLinkableCardGroup"

const FrequentlyAskedQuestions = () => {
  const { profile } = useContext(AuthContext)

  useEffect(() => {
    pushGtmEvent<PageView>({
      event: "pageView",
      pageTitle: "FrequentlyAskedQuestions",
      status: profile ? UserStatus.LoggedIn : UserStatus.NotLoggedIn,
    })
  }, [profile])

  const metaDescription = t("pageDescription.questions")

  return (
    <Layout>
      <PageHeader title={t("pageTitle.questions")} />
      <MetaTags title={t("pageTitle.questions")} description={metaDescription} />
      <div className="lg:my-14">
        <DoorwayLinkableCardGroup
          cards={questionsLinkableCards()}
          className="m-auto"
        ></DoorwayLinkableCardGroup>
      </div>
    </Layout>
  )
}

export default FrequentlyAskedQuestions
